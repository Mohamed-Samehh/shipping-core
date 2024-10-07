import { Zone } from '../domain/zone';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ZoneRepository extends MemoryStore<Zone> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
  }

  protected override entityName(): string {
    return 'zone';
  }

  findByCarrier(value: string): Zone[] {
    return this.findByIndex('carrier', value);
  }
}
