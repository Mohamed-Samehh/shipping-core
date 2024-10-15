import { Contract } from '../domain/contract';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ContractRepository extends MemoryStore<Contract> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'contract';
  }

  findByCustomer(value: string): Contract[] {
    return this.findByIndex('customer', value);
  }

  findByStatus(value: string): Contract[] {
    return this.findByIndex('status', value);
  }
}
