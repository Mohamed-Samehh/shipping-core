import { ManifestEntry } from '../domain/manifest-entry';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ManifestEntryRepository extends MemoryStore<ManifestEntry> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('manifest', (e) => e.manifestId);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('tracking', (e) => e.trackingNumber);
  }

  protected override entityName(): string {
    return 'manifest entry';
  }

  findByManifest(value: string): ManifestEntry[] {
    return this.findByIndex('manifest', value);
  }

  findByShipment(value: string): ManifestEntry[] {
    return this.findByIndex('shipment', value);
  }

  findByTracking(value: string): ManifestEntry[] {
    return this.findByIndex('tracking', value);
  }
}
