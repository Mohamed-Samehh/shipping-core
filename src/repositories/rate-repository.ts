import { Rate } from '../domain/rate';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class RateRepository extends MemoryStore<Rate> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('service', (e) => e.serviceId);
  }

  protected override entityName(): string {
    return 'rate';
  }

  findByShipment(value: string): Rate[] {
    return this.findByIndex('shipment', value);
  }

  findByCarrier(value: string): Rate[] {
    return this.findByIndex('carrier', value);
  }

  findByService(value: string): Rate[] {
    return this.findByIndex('service', value);
  }
}
