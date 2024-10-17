import { Surcharge, parseSurcharge, SurchargeSchema } from '../domain/surcharge';
import { SurchargeRepository } from '../repositories/surcharge-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateSurchargeInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateSurchargeInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class SurchargeService {
  constructor(
    private readonly repository: SurchargeRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateSurchargeInput): Surcharge {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('sch'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(SurchargeSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'surcharge.create',
      entityKind: 'surcharge',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateSurchargeInput): Surcharge {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(SurchargeSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'surcharge.update',
      entityKind: 'surcharge',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Surcharge {
    return this.repository.get(id);
  }

  tryGet(id: string): Surcharge | undefined {
    return this.repository.tryGet(id);
  }

  list(): Surcharge[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('SURCHARGE_NOT_FOUND', 'surcharge ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'surcharge.remove',
      entityKind: 'surcharge',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
