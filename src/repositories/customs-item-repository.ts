import { CustomsItem } from '../domain/customs-item';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class CustomsItemRepository extends MemoryStore<CustomsItem> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('declaration', (e) => e.declarationId);
  }

  protected override entityName(): string {
    return 'customs item';
  }

  findByDeclaration(value: string): CustomsItem[] {
    return this.findByIndex('declaration', value);
  }
}
