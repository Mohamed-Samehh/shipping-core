import { Discount } from '../domain/discount';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class DiscountRepository extends MemoryStore<Discount> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('carrier', (e) => e.carrierId);
  }

  protected override entityName(): string {
    return 'discount';
  }

  findByCustomer(value: string): Discount[] {
    return this.findByIndex('customer', value);
  }

  findByCarrier(value: string): Discount[] {
    return this.findByIndex('carrier', value);
  }
}
