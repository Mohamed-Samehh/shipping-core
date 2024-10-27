import { Location, parseLocation, LocationSchema } from '../domain/location';
import { LocationRepository } from '../repositories/location-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateLocationInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateLocationInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class LocationService {
  constructor(
    private readonly repository: LocationRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateLocationInput): Location {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('loc'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(LocationSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'location.create',
      entityKind: 'location',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateLocationInput): Location {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(LocationSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'location.update',
      entityKind: 'location',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Location {
    return this.repository.get(id);
  }

  tryGet(id: string): Location | undefined {
    return this.repository.tryGet(id);
  }

  list(): Location[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('LOCATION_NOT_FOUND', 'location ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'location.remove',
      entityKind: 'location',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
