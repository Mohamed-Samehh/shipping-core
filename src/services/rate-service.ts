import { Rate, parseRate, RateSchema } from '../domain/rate';
import { RateRepository } from '../repositories/rate-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateRateInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateRateInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class RateService {
  constructor(
    private readonly repository: RateRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateRateInput): Rate {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('rt'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(RateSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'rate.create',
      entityKind: 'rate',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateRateInput): Rate {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(RateSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'rate.update',
      entityKind: 'rate',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Rate {
    return this.repository.get(id);
  }

  tryGet(id: string): Rate | undefined {
    return this.repository.tryGet(id);
  }

  list(): Rate[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('RATE_NOT_FOUND', 'rate ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'rate.remove',
      entityKind: 'rate',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
