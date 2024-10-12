import { Surcharge } from '../domain/surcharge';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class SurchargeRepository extends MemoryStore<Surcharge> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('service', (e) => e.serviceId);
  }

  protected override entityName(): string {
    return 'surcharge';
  }

  findByCarrier(value: string): Surcharge[] {
    return this.findByIndex('carrier', value);
  }

  findByService(value: string): Surcharge[] {
    return this.findByIndex('service', value);
  }
}
