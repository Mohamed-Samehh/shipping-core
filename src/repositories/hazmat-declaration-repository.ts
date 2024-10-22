import { HazmatDeclaration } from '../domain/hazmat-declaration';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class HazmatDeclarationRepository extends MemoryStore<HazmatDeclaration> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'hazmat declaration';
  }

  findByShipment(value: string): HazmatDeclaration[] {
    return this.findByIndex('shipment', value);
  }
}
