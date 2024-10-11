import { RateRequest } from '../domain/rate-request';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class RateRequestRepository extends MemoryStore<RateRequest> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'rate request';
  }

  findByCustomer(value: string): RateRequest[] {
    return this.findByIndex('customer', value);
  }

  findByShipment(value: string): RateRequest[] {
    return this.findByIndex('shipment', value);
  }
}
