import { Insurance } from '../domain/insurance';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class InsuranceRepository extends MemoryStore<Insurance> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('policy', (e) => e.policyNumber);
  }

  protected override entityName(): string {
    return 'insurance';
  }

  findByShipment(value: string): Insurance[] {
    return this.findByIndex('shipment', value);
  }

  findByPolicy(value: string): Insurance[] {
    return this.findByIndex('policy', value);
  }
}
