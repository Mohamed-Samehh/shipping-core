import { Quote } from '../domain/quote';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class QuoteRepository extends MemoryStore<Quote> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'quote';
  }

  findByCustomer(value: string): Quote[] {
    return this.findByIndex('customer', value);
  }

  findByStatus(value: string): Quote[] {
    return this.findByIndex('status', value);
  }
}
