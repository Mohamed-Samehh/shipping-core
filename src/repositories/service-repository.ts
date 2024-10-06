import { Service } from '../domain/service';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ServiceRepository extends MemoryStore<Service> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('code', (e) => e.code);
  }

  protected override entityName(): string {
    return 'service';
  }

  findByCarrier(value: string): Service[] {
    return this.findByIndex('carrier', value);
  }

  findByCode(value: string): Service[] {
    return this.findByIndex('code', value);
  }
}
