import { PickupRequest, parsePickupRequest, PickupRequestSchema } from '../domain/pickup-request';
import { PickupRequestRepository } from '../repositories/pickup-request-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreatePickupRequestInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdatePickupRequestInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class PickupRequestService {
  constructor(
    private readonly repository: PickupRequestRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreatePickupRequestInput): PickupRequest {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('pu'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(PickupRequestSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'pickup_request.create',
      entityKind: 'pickup-request',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdatePickupRequestInput): PickupRequest {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(PickupRequestSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'pickup_request.update',
      entityKind: 'pickup-request',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): PickupRequest {
    return this.repository.get(id);
  }

  tryGet(id: string): PickupRequest | undefined {
    return this.repository.tryGet(id);
  }

  list(): PickupRequest[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('PICKUP_REQUEST_NOT_FOUND', 'pickup-request ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'pickup_request.remove',
      entityKind: 'pickup-request',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
