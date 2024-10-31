import { Driver, parseDriver, DriverSchema } from '../domain/driver';
import { DriverRepository } from '../repositories/driver-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateDriverInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateDriverInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class DriverService {
  constructor(
    private readonly repository: DriverRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateDriverInput): Driver {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('dr'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(DriverSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'driver.create',
      entityKind: 'driver',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateDriverInput): Driver {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(DriverSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'driver.update',
      entityKind: 'driver',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Driver {
    return this.repository.get(id);
  }

  tryGet(id: string): Driver | undefined {
    return this.repository.tryGet(id);
  }

  list(): Driver[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('DRIVER_NOT_FOUND', 'driver ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'driver.remove',
      entityKind: 'driver',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
