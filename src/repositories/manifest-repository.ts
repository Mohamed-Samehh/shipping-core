import { Manifest } from '../domain/manifest';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ManifestRepository extends MemoryStore<Manifest> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'manifest';
  }

  findByCarrier(value: string): Manifest[] {
    return this.findByIndex('carrier', value);
  }

  findByStatus(value: string): Manifest[] {
    return this.findByIndex('status', value);
  }
}
