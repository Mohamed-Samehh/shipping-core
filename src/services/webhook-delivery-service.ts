import { WebhookDelivery, parseWebhookDelivery, WebhookDeliverySchema } from '../domain/webhook-delivery';
import { WebhookDeliveryRepository } from '../repositories/webhook-delivery-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateWebhookDeliveryInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateWebhookDeliveryInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class WebhookDeliveryService {
  constructor(
    private readonly repository: WebhookDeliveryRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateWebhookDeliveryInput): WebhookDelivery {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('wd'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(WebhookDeliverySchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'webhook_delivery.create',
      entityKind: 'webhook-delivery',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateWebhookDeliveryInput): WebhookDelivery {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(WebhookDeliverySchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'webhook_delivery.update',
      entityKind: 'webhook-delivery',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): WebhookDelivery {
    return this.repository.get(id);
  }

  tryGet(id: string): WebhookDelivery | undefined {
    return this.repository.tryGet(id);
  }

  list(): WebhookDelivery[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('WEBHOOK_DELIVERY_NOT_FOUND', 'webhook-delivery ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'webhook_delivery.remove',
      entityKind: 'webhook-delivery',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
