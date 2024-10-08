import { Shipment } from '../domain/shipment';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ShipmentRepository extends MemoryStore<Shipment> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('status', (e) => e.status);
    this.addIndex('tracking', (e) => e.trackingNumber);
  }

  protected override entityName(): string {
    return 'shipment';
  }

  findByCustomer(value: string): Shipment[] {
    return this.findByIndex('customer', value);
  }

  findByStatus(value: string): Shipment[] {
    return this.findByIndex('status', value);
  }

  findByTracking(value: string): Shipment[] {
    return this.findByIndex('tracking', value);
  }
}
