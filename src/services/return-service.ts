import { Return, parseReturn, ReturnSchema } from '../domain/return';
import { ReturnRepository } from '../repositories/return-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateReturnInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateReturnInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ReturnService {
  constructor(
    private readonly repository: ReturnRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateReturnInput): Return {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ret'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ReturnSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'return.create',
      entityKind: 'return',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateReturnInput): Return {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ReturnSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'return.update',
      entityKind: 'return',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Return {
    return this.repository.get(id);
  }

  tryGet(id: string): Return | undefined {
    return this.repository.tryGet(id);
  }

  list(): Return[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('RETURN_NOT_FOUND', 'return ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'return.remove',
      entityKind: 'return',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
