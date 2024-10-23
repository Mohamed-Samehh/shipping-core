import { Quote, parseQuote, QuoteSchema } from '../domain/quote';
import { QuoteRepository } from '../repositories/quote-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateQuoteInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateQuoteInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class QuoteService {
  constructor(
    private readonly repository: QuoteRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateQuoteInput): Quote {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('qt'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(QuoteSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'quote.create',
      entityKind: 'quote',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateQuoteInput): Quote {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(QuoteSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'quote.update',
      entityKind: 'quote',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Quote {
    return this.repository.get(id);
  }

  tryGet(id: string): Quote | undefined {
    return this.repository.tryGet(id);
  }

  list(): Quote[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('QUOTE_NOT_FOUND', 'quote ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'quote.remove',
      entityKind: 'quote',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
