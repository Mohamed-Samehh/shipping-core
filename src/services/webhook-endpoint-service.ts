import { WebhookEndpoint, parseWebhookEndpoint, WebhookEndpointSchema } from '../domain/webhook-endpoint';
import { WebhookEndpointRepository } from '../repositories/webhook-endpoint-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateWebhookEndpointInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateWebhookEndpointInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class WebhookEndpointService {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateWebhookEndpointInput): WebhookEndpoint {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('we'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(WebhookEndpointSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'webhook_endpoint.create',
      entityKind: 'webhook-endpoint',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateWebhookEndpointInput): WebhookEndpoint {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(WebhookEndpointSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'webhook_endpoint.update',
      entityKind: 'webhook-endpoint',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): WebhookEndpoint {
    return this.repository.get(id);
  }

  tryGet(id: string): WebhookEndpoint | undefined {
    return this.repository.tryGet(id);
  }

  list(): WebhookEndpoint[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('WEBHOOK_ENDPOINT_NOT_FOUND', 'webhook-endpoint ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'webhook_endpoint.remove',
      entityKind: 'webhook-endpoint',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
