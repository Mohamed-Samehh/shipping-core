import { Carrier } from '../domain/carrier';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class CarrierRepository extends MemoryStore<Carrier> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('code', (e) => e.code);
  }

  protected override entityName(): string {
    return 'carrier';
  }

  findByCode(value: string): Carrier[] {
    return this.findByIndex('code', value);
  }
}
