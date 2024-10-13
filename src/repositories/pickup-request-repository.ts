import { PickupRequest } from '../domain/pickup-request';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class PickupRequestRepository extends MemoryStore<PickupRequest> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('status', (e) => e.status);
    this.addIndex('address', (e) => e.addressId);
  }

  protected override entityName(): string {
    return 'pickup request';
  }

  findByCarrier(value: string): PickupRequest[] {
    return this.findByIndex('carrier', value);
  }

  findByStatus(value: string): PickupRequest[] {
    return this.findByIndex('status', value);
  }

  findByAddress(value: string): PickupRequest[] {
    return this.findByIndex('address', value);
  }
}
