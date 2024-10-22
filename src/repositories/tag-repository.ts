import { Tag } from '../domain/tag';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class TagRepository extends MemoryStore<Tag> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('entity', (e) => e.entityId);
    this.addIndex('key', (e) => e.key);
  }

  protected override entityName(): string {
    return 'tag';
  }

  findByEntity(value: string): Tag[] {
    return this.findByIndex('entity', value);
  }

  findByKey(value: string): Tag[] {
    return this.findByIndex('key', value);
  }
}
