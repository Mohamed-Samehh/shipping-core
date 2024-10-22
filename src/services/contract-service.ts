import { Contract, parseContract, ContractSchema } from '../domain/contract';
import { ContractRepository } from '../repositories/contract-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateContractInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateContractInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ContractService {
  constructor(
    private readonly repository: ContractRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateContractInput): Contract {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ct'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ContractSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'contract.create',
      entityKind: 'contract',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateContractInput): Contract {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ContractSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'contract.update',
      entityKind: 'contract',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Contract {
    return this.repository.get(id);
  }

  tryGet(id: string): Contract | undefined {
    return this.repository.tryGet(id);
  }

  list(): Contract[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('CONTRACT_NOT_FOUND', 'contract ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'contract.remove',
      entityKind: 'contract',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
