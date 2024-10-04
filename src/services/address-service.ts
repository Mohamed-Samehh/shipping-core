import { Address, parseAddress, AddressSchema } from '../domain/address';
import { AddressRepository } from '../repositories/address-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateAddressInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateAddressInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class AddressService {
  constructor(
    private readonly repository: AddressRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateAddressInput): Address {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('adr'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(AddressSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'address.create',
      entityKind: 'address',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateAddressInput): Address {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(AddressSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'address.update',
      entityKind: 'address',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Address {
    return this.repository.get(id);
  }

  tryGet(id: string): Address | undefined {
    return this.repository.tryGet(id);
  }

  list(): Address[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('ADDRESS_NOT_FOUND', 'address ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'address.remove',
      entityKind: 'address',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
