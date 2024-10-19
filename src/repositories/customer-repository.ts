import { Customer } from '../domain/customer';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class CustomerRepository extends MemoryStore<Customer> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('externalRef', (e) => e.externalRef);
    this.addIndex('email', (e) => e.email?.toLowerCase());
  }

  protected override entityName(): string {
    return 'customer';
  }

  findByExternalRef(value: string): Customer[] {
    return this.findByIndex('externalRef', value);
  }

  findByEmail(value: string): Customer[] {
    return this.findByIndex('email', value.toLowerCase());
  }
}
