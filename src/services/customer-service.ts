import { Customer, parseCustomer, CustomerSchema } from '../domain/customer';
import { CustomerRepository } from '../repositories/customer-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateCustomerInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateCustomerInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateCustomerInput): Customer {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('cu'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(CustomerSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'customer.create',
      entityKind: 'customer',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateCustomerInput): Customer {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(CustomerSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'customer.update',
      entityKind: 'customer',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Customer {
    return this.repository.get(id);
  }

  tryGet(id: string): Customer | undefined {
    return this.repository.tryGet(id);
  }

  list(): Customer[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('CUSTOMER_NOT_FOUND', 'customer ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'customer.remove',
      entityKind: 'customer',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
