import { WebhookEndpoint } from '../domain/webhook-endpoint';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class WebhookEndpointRepository extends MemoryStore<WebhookEndpoint> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
  }

  protected override entityName(): string {
    return 'webhook endpoint';
  }

  findByCustomer(value: string): WebhookEndpoint[] {
    return this.findByIndex('customer', value);
  }
}
