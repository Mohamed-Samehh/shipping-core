import { ManifestEntry, parseManifestEntry, ManifestEntrySchema } from '../domain/manifest-entry';
import { ManifestEntryRepository } from '../repositories/manifest-entry-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateManifestEntryInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateManifestEntryInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ManifestEntryService {
  constructor(
    private readonly repository: ManifestEntryRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateManifestEntryInput): ManifestEntry {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('me'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ManifestEntrySchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'manifest_entry.create',
      entityKind: 'manifest-entry',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateManifestEntryInput): ManifestEntry {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ManifestEntrySchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'manifest_entry.update',
      entityKind: 'manifest-entry',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): ManifestEntry {
    return this.repository.get(id);
  }

  tryGet(id: string): ManifestEntry | undefined {
    return this.repository.tryGet(id);
  }

  list(): ManifestEntry[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('MANIFEST_ENTRY_NOT_FOUND', 'manifest-entry ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'manifest_entry.remove',
      entityKind: 'manifest-entry',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
