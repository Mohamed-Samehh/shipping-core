import { Location } from '../domain/location';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class LocationRepository extends MemoryStore<Location> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('code', (e) => e.code);
  }

  protected override entityName(): string {
    return 'location';
  }

  findByCustomer(value: string): Location[] {
    return this.findByIndex('customer', value);
  }

  findByCode(value: string): Location[] {
    return this.findByIndex('code', value);
  }
}
