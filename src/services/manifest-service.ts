import { Manifest, parseManifest, ManifestSchema } from '../domain/manifest';
import { ManifestRepository } from '../repositories/manifest-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateManifestInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateManifestInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ManifestService {
  constructor(
    private readonly repository: ManifestRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateManifestInput): Manifest {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('mf'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ManifestSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'manifest.create',
      entityKind: 'manifest',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateManifestInput): Manifest {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ManifestSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'manifest.update',
      entityKind: 'manifest',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Manifest {
    return this.repository.get(id);
  }

  tryGet(id: string): Manifest | undefined {
    return this.repository.tryGet(id);
  }

  list(): Manifest[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('MANIFEST_NOT_FOUND', 'manifest ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'manifest.remove',
      entityKind: 'manifest',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
