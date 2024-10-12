import { CustomsDeclaration } from '../domain/customs-declaration';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class CustomsDeclarationRepository extends MemoryStore<CustomsDeclaration> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'customs declaration';
  }

  findByShipment(value: string): CustomsDeclaration[] {
    return this.findByIndex('shipment', value);
  }
}
