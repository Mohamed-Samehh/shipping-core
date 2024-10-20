import { RouteStop } from '../domain/route-stop';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class RouteStopRepository extends MemoryStore<RouteStop> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('route', (e) => e.routeId);
    this.addIndex('pickup', (e) => e.pickupRequestId);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'route stop';
  }

  findByRoute(value: string): RouteStop[] {
    return this.findByIndex('route', value);
  }

  findByPickup(value: string): RouteStop[] {
    return this.findByIndex('pickup', value);
  }

  findByShipment(value: string): RouteStop[] {
    return this.findByIndex('shipment', value);
  }
}
