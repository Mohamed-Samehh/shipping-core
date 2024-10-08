import { Package } from '../domain/package';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class PackageRepository extends MemoryStore<Package> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'package';
  }

  findByShipment(value: string): Package[] {
    return this.findByIndex('shipment', value);
  }
}
