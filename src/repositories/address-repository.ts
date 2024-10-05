import { Address } from '../domain/address';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class AddressRepository extends MemoryStore<Address> {
  constructor(clock: Clock) {
    super(clock);
  }

  protected override entityName(): string {
    return 'address';
  }
}
