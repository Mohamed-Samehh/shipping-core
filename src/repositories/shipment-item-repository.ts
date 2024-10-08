import { ShipmentItem } from '../domain/shipment-item';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ShipmentItemRepository extends MemoryStore<ShipmentItem> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('package', (e) => e.packageId);
  }

  protected override entityName(): string {
    return 'shipment item';
  }

  findByShipment(value: string): ShipmentItem[] {
    return this.findByIndex('shipment', value);
  }

  findByPackage(value: string): ShipmentItem[] {
    return this.findByIndex('package', value);
  }
}
