import { Carrier, parseCarrier, CarrierSchema } from '../domain/carrier';
import { CarrierRepository } from '../repositories/carrier-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateCarrierInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateCarrierInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class CarrierService {
  constructor(
    private readonly repository: CarrierRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateCarrierInput): Carrier {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('car'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(CarrierSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'carrier.create',
      entityKind: 'carrier',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateCarrierInput): Carrier {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(CarrierSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'carrier.update',
      entityKind: 'carrier',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Carrier {
    return this.repository.get(id);
  }

  tryGet(id: string): Carrier | undefined {
    return this.repository.tryGet(id);
  }

  list(): Carrier[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('CARRIER_NOT_FOUND', 'carrier ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'carrier.remove',
      entityKind: 'carrier',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
