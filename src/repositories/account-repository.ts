import { Account } from '../domain/account';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class AccountRepository extends MemoryStore<Account> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('externalRef', (e) => e.externalRef);
  }

  protected override entityName(): string {
    return 'account';
  }

  findByCarrier(value: string): Account[] {
    return this.findByIndex('carrier', value);
  }

  findByExternalRef(value: string): Account[] {
    return this.findByIndex('externalRef', value);
  }
}
