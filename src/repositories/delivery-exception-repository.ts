import { DeliveryException } from '../domain/delivery-exception';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class DeliveryExceptionRepository extends MemoryStore<DeliveryException> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('category', (e) => e.category);
  }

  protected override entityName(): string {
    return 'delivery exception';
  }

  findByShipment(value: string): DeliveryException[] {
    return this.findByIndex('shipment', value);
  }

  findByCategory(value: string): DeliveryException[] {
    return this.findByIndex('category', value);
  }
}
