import { WebhookDelivery } from '../domain/webhook-delivery';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class WebhookDeliveryRepository extends MemoryStore<WebhookDelivery> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('endpoint', (e) => e.endpointId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'webhook delivery';
  }

  findByEndpoint(value: string): WebhookDelivery[] {
    return this.findByIndex('endpoint', value);
  }

  findByStatus(value: string): WebhookDelivery[] {
    return this.findByIndex('status', value);
  }
}
