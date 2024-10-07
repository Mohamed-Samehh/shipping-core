import { Zone, parseZone, ZoneSchema } from '../domain/zone';
import { ZoneRepository } from '../repositories/zone-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateZoneInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateZoneInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ZoneService {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateZoneInput): Zone {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('zone'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ZoneSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'zone.create',
      entityKind: 'zone',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateZoneInput): Zone {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ZoneSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'zone.update',
      entityKind: 'zone',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Zone {
    return this.repository.get(id);
  }

  tryGet(id: string): Zone | undefined {
    return this.repository.tryGet(id);
  }

  list(): Zone[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('ZONE_NOT_FOUND', 'zone ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'zone.remove',
      entityKind: 'zone',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
