import { Forecast } from '../domain/forecast';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ForecastRepository extends MemoryStore<Forecast> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('scope', (e) => e.scope);
    this.addIndex('customer', (e) => e.customerId);
  }

  protected override entityName(): string {
    return 'forecast';
  }

  findByScope(value: string): Forecast[] {
    return this.findByIndex('scope', value);
  }

  findByCustomer(value: string): Forecast[] {
    return this.findByIndex('customer', value);
  }
}
