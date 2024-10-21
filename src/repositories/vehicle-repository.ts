import { Vehicle } from '../domain/vehicle';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class VehicleRepository extends MemoryStore<Vehicle> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('registration', (e) => e.registration);
  }

  protected override entityName(): string {
    return 'vehicle';
  }

  findByRegistration(value: string): Vehicle[] {
    return this.findByIndex('registration', value);
  }
}
