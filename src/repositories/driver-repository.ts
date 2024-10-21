import { Driver } from '../domain/driver';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class DriverRepository extends MemoryStore<Driver> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'driver';
  }

  findByStatus(value: string): Driver[] {
    return this.findByIndex('status', value);
  }
}
