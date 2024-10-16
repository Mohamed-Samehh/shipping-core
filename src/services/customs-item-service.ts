import { CustomsItem, parseCustomsItem, CustomsItemSchema } from '../domain/customs-item';
import { CustomsItemRepository } from '../repositories/customs-item-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateCustomsItemInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateCustomsItemInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class CustomsItemService {
  constructor(
    private readonly repository: CustomsItemRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateCustomsItemInput): CustomsItem {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ci'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(CustomsItemSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'customs_item.create',
      entityKind: 'customs-item',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateCustomsItemInput): CustomsItem {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(CustomsItemSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'customs_item.update',
      entityKind: 'customs-item',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): CustomsItem {
    return this.repository.get(id);
  }

  tryGet(id: string): CustomsItem | undefined {
    return this.repository.tryGet(id);
  }

  list(): CustomsItem[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('CUSTOMS_ITEM_NOT_FOUND', 'customs-item ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'customs_item.remove',
      entityKind: 'customs-item',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
