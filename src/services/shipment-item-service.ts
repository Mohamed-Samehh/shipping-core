import { ShipmentItem, parseShipmentItem, ShipmentItemSchema } from '../domain/shipment-item';
import { ShipmentItemRepository } from '../repositories/shipment-item-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateShipmentItemInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateShipmentItemInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ShipmentItemService {
  constructor(
    private readonly repository: ShipmentItemRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateShipmentItemInput): ShipmentItem {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('si'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ShipmentItemSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'shipment_item.create',
      entityKind: 'shipment-item',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateShipmentItemInput): ShipmentItem {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ShipmentItemSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'shipment_item.update',
      entityKind: 'shipment-item',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): ShipmentItem {
    return this.repository.get(id);
  }

  tryGet(id: string): ShipmentItem | undefined {
    return this.repository.tryGet(id);
  }

  list(): ShipmentItem[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('SHIPMENT_ITEM_NOT_FOUND', 'shipment-item ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'shipment_item.remove',
      entityKind: 'shipment-item',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
