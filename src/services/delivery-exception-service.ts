import { DeliveryException, parseDeliveryException, DeliveryExceptionSchema } from '../domain/delivery-exception';
import { DeliveryExceptionRepository } from '../repositories/delivery-exception-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateDeliveryExceptionInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateDeliveryExceptionInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class DeliveryExceptionService {
  constructor(
    private readonly repository: DeliveryExceptionRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateDeliveryExceptionInput): DeliveryException {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('exc'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(DeliveryExceptionSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'delivery_exception.create',
      entityKind: 'delivery-exception',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateDeliveryExceptionInput): DeliveryException {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(DeliveryExceptionSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'delivery_exception.update',
      entityKind: 'delivery-exception',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): DeliveryException {
    return this.repository.get(id);
  }

  tryGet(id: string): DeliveryException | undefined {
    return this.repository.tryGet(id);
  }

  list(): DeliveryException[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('DELIVERY_EXCEPTION_NOT_FOUND', 'delivery-exception ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'delivery_exception.remove',
      entityKind: 'delivery-exception',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
