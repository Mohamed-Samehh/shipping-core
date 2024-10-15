import { ProofOfDelivery } from '../domain/proof-of-delivery';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ProofOfDeliveryRepository extends MemoryStore<ProofOfDelivery> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('tracking', (e) => e.trackingNumber);
  }

  protected override entityName(): string {
    return 'proof of delivery';
  }

  findByShipment(value: string): ProofOfDelivery[] {
    return this.findByIndex('shipment', value);
  }

  findByTracking(value: string): ProofOfDelivery[] {
    return this.findByIndex('tracking', value);
  }
}
