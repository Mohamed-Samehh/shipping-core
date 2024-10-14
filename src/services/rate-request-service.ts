import { RateRequest, parseRateRequest, RateRequestSchema } from '../domain/rate-request';
import { RateRequestRepository } from '../repositories/rate-request-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateRateRequestInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateRateRequestInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class RateRequestService {
  constructor(
    private readonly repository: RateRequestRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateRateRequestInput): RateRequest {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('rr'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(RateRequestSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'rate_request.create',
      entityKind: 'rate-request',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateRateRequestInput): RateRequest {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(RateRequestSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'rate_request.update',
      entityKind: 'rate-request',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): RateRequest {
    return this.repository.get(id);
  }

  tryGet(id: string): RateRequest | undefined {
    return this.repository.tryGet(id);
  }

  list(): RateRequest[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('RATE_REQUEST_NOT_FOUND', 'rate-request ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'rate_request.remove',
      entityKind: 'rate-request',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
