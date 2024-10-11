import { TrackingEvent } from '../domain/tracking-event';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class TrackingEventRepository extends MemoryStore<TrackingEvent> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('tracking', (e) => e.trackingNumber);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'tracking event';
  }

  findByShipment(value: string): TrackingEvent[] {
    return this.findByIndex('shipment', value);
  }

  findByTracking(value: string): TrackingEvent[] {
    return this.findByIndex('tracking', value);
  }

  findByStatus(value: string): TrackingEvent[] {
    return this.findByIndex('status', value);
  }
}
