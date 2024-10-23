import { DispatchSlot } from '../domain/dispatch-slot';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class DispatchSlotRepository extends MemoryStore<DispatchSlot> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('location', (e) => e.locationId);
  }

  protected override entityName(): string {
    return 'dispatch slot';
  }

  findByCarrier(value: string): DispatchSlot[] {
    return this.findByIndex('carrier', value);
  }

  findByLocation(value: string): DispatchSlot[] {
    return this.findByIndex('location', value);
  }
}
