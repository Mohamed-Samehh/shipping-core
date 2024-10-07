import { Account, parseAccount, AccountSchema } from '../domain/account';
import { AccountRepository } from '../repositories/account-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateAccountInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateAccountInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class AccountService {
  constructor(
    private readonly repository: AccountRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateAccountInput): Account {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('acct'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(AccountSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'account.create',
      entityKind: 'account',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateAccountInput): Account {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(AccountSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'account.update',
      entityKind: 'account',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Account {
    return this.repository.get(id);
  }

  tryGet(id: string): Account | undefined {
    return this.repository.tryGet(id);
  }

  list(): Account[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND', 'account ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'account.remove',
      entityKind: 'account',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
