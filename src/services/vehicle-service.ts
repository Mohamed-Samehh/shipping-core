import { Vehicle, parseVehicle, VehicleSchema } from '../domain/vehicle';
import { VehicleRepository } from '../repositories/vehicle-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateVehicleInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateVehicleInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class VehicleService {
  constructor(
    private readonly repository: VehicleRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateVehicleInput): Vehicle {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('vh'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(VehicleSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'vehicle.create',
      entityKind: 'vehicle',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateVehicleInput): Vehicle {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(VehicleSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'vehicle.update',
      entityKind: 'vehicle',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Vehicle {
    return this.repository.get(id);
  }

  tryGet(id: string): Vehicle | undefined {
    return this.repository.tryGet(id);
  }

  list(): Vehicle[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('VEHICLE_NOT_FOUND', 'vehicle ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'vehicle.remove',
      entityKind: 'vehicle',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
