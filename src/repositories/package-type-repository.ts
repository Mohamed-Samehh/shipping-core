import { PackageType } from '../domain/package-type';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class PackageTypeRepository extends MemoryStore<PackageType> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('code', (e) => e.code);
  }

  protected override entityName(): string {
    return 'package type';
  }

  findByCode(value: string): PackageType[] {
    return this.findByIndex('code', value);
  }
}
