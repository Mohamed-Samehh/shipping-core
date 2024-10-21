import { Insurance, parseInsurance, InsuranceSchema } from '../domain/insurance';
import { InsuranceRepository } from '../repositories/insurance-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateInsuranceInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateInsuranceInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class InsuranceService {
  constructor(
    private readonly repository: InsuranceRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateInsuranceInput): Insurance {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ins'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(InsuranceSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'insurance.create',
      entityKind: 'insurance',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateInsuranceInput): Insurance {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(InsuranceSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'insurance.update',
      entityKind: 'insurance',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Insurance {
    return this.repository.get(id);
  }

  tryGet(id: string): Insurance | undefined {
    return this.repository.tryGet(id);
  }

  list(): Insurance[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('INSURANCE_NOT_FOUND', 'insurance ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'insurance.remove',
      entityKind: 'insurance',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
