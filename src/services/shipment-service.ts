import { Shipment, parseShipment, ShipmentSchema } from '../domain/shipment';
import { ShipmentRepository } from '../repositories/shipment-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateShipmentInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateShipmentInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ShipmentService {
  constructor(
    private readonly repository: ShipmentRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateShipmentInput): Shipment {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('shp'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ShipmentSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'shipment.create',
      entityKind: 'shipment',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateShipmentInput): Shipment {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ShipmentSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'shipment.update',
      entityKind: 'shipment',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Shipment {
    return this.repository.get(id);
  }

  tryGet(id: string): Shipment | undefined {
    return this.repository.tryGet(id);
  }

  list(): Shipment[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('SHIPMENT_NOT_FOUND', 'shipment ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'shipment.remove',
      entityKind: 'shipment',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
