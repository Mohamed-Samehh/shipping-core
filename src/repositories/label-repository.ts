import { Label } from '../domain/label';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class LabelRepository extends MemoryStore<Label> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('package', (e) => e.packageId);
    this.addIndex('tracking', (e) => e.trackingNumber);
  }

  protected override entityName(): string {
    return 'label';
  }

  findByShipment(value: string): Label[] {
    return this.findByIndex('shipment', value);
  }

  findByPackage(value: string): Label[] {
    return this.findByIndex('package', value);
  }

  findByTracking(value: string): Label[] {
    return this.findByIndex('tracking', value);
  }
}
