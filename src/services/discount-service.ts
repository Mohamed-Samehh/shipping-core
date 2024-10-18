import { Discount, parseDiscount, DiscountSchema } from '../domain/discount';
import { DiscountRepository } from '../repositories/discount-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateDiscountInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateDiscountInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class DiscountService {
  constructor(
    private readonly repository: DiscountRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateDiscountInput): Discount {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('dsc'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(DiscountSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'discount.create',
      entityKind: 'discount',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateDiscountInput): Discount {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(DiscountSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'discount.update',
      entityKind: 'discount',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Discount {
    return this.repository.get(id);
  }

  tryGet(id: string): Discount | undefined {
    return this.repository.tryGet(id);
  }

  list(): Discount[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('DISCOUNT_NOT_FOUND', 'discount ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'discount.remove',
      entityKind: 'discount',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
