import { Return } from '../domain/return';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ReturnRepository extends MemoryStore<Return> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('shipment', (e) => e.outboundShipmentId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'return';
  }

  findByCustomer(value: string): Return[] {
    return this.findByIndex('customer', value);
  }

  findByShipment(value: string): Return[] {
    return this.findByIndex('shipment', value);
  }

  findByStatus(value: string): Return[] {
    return this.findByIndex('status', value);
  }
}
