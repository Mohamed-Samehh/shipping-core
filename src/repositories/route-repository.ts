import { Route } from '../domain/route';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class RouteRepository extends MemoryStore<Route> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('status', (e) => e.status);
    this.addIndex('driver', (e) => e.driverId);
    this.addIndex('vehicle', (e) => e.vehicleId);
  }

  protected override entityName(): string {
    return 'route';
  }

  findByStatus(value: string): Route[] {
    return this.findByIndex('status', value);
  }

  findByDriver(value: string): Route[] {
    return this.findByIndex('driver', value);
  }

  findByVehicle(value: string): Route[] {
    return this.findByIndex('vehicle', value);
  }
}
