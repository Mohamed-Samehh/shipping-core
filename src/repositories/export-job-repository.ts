import { ExportJob } from '../domain/export-job';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ExportJobRepository extends MemoryStore<ExportJob> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('status', (e) => e.status);
    this.addIndex('kind', (e) => e.kind);
  }

  protected override entityName(): string {
    return 'export job';
  }

  findByCustomer(value: string): ExportJob[] {
    return this.findByIndex('customer', value);
  }

  findByStatus(value: string): ExportJob[] {
    return this.findByIndex('status', value);
  }

  findByKind(value: string): ExportJob[] {
    return this.findByIndex('kind', value);
  }
}
