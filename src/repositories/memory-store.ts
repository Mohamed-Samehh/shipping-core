// Base class for all in-memory repositories. Provides id-keyed primary
// lookup, secondary indexing by arbitrary accessors, pagination, and a
// list-with-filter helper that every repo implementation reuses.

import { Clock } from '../lib/clock';
import { Page, PageParams, paginate } from '../lib/pagination';
import { stableSort, CompareFn } from '../lib/sort';
import { NotFoundError } from '../errors';

export interface HasId {
  readonly id: string;
}

export interface ListOptions<T> extends PageParams {
  readonly filter?: (item: T) => boolean;
  readonly sort?: CompareFn<T>;
}

export abstract class MemoryStore<T extends HasId> {
  protected readonly entries = new Map<string, T>();
  protected readonly indexes = new Map<string, Map<string, Set<string>>>();
  private readonly indexAccessors = new Map<string, (item: T) => string | undefined>();
  protected readonly clock: Clock;

  constructor(clock: Clock) {
    this.clock = clock;
  }

  protected abstract entityName(): string;

  size(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
    this.indexes.clear();
  }

  get(id: string): T {
    const value = this.entries.get(id);
    if (!value) {
      throw new NotFoundError(
        `${this.entityName().toUpperCase()}_NOT_FOUND`,
        `${this.entityName()} ${id} not found`,
        { id },
      );
    }
    return value;
  }

  tryGet(id: string): T | undefined {
    return this.entries.get(id);
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  store(entity: T): T {
    const existing = this.entries.get(entity.id);
    if (existing) this.unindex(existing);
    this.entries.set(entity.id, entity);
    this.indexEntity(entity);
    return entity;
  }

  remove(id: string): boolean {
    const existing = this.entries.get(id);
    if (!existing) return false;
    this.unindex(existing);
    return this.entries.delete(id);
  }

  list(options: ListOptions<T> = {}): Page<T> {
    let items = Array.from(this.entries.values());
    if (options.filter) items = items.filter(options.filter);
    if (options.sort) items = stableSort(items, options.sort);
    return paginate(items, options);
  }

  listAll(filter?: (item: T) => boolean): T[] {
    const items = Array.from(this.entries.values());
    return filter ? items.filter(filter) : items;
  }

  count(filter?: (item: T) => boolean): number {
    if (!filter) return this.entries.size;
    let count = 0;
    for (const item of this.entries.values()) if (filter(item)) count += 1;
    return count;
  }

  protected addIndex(name: string, accessor: (item: T) => string | undefined): void {
    if (this.indexes.has(name)) {
      throw new Error(`index ${name} already registered`);
    }
    const index = new Map<string, Set<string>>();
    this.indexes.set(name, index);
    this.indexAccessors.set(name, accessor);
    for (const entity of this.entries.values()) {
      const key = accessor(entity);
      if (key === undefined) continue;
      let set = index.get(key);
      if (!set) { set = new Set<string>(); index.set(key, set); }
      set.add(entity.id);
    }
  }

  protected findByIndex(name: string, key: string): T[] {
    const ids = this.indexes.get(name)?.get(key);
    if (!ids) return [];
    const out: T[] = [];
    for (const id of ids) {
      const entity = this.entries.get(id);
      if (entity) out.push(entity);
    }
    return out;
  }

  private indexEntity(entity: T): void {
    for (const [name, accessor] of this.indexAccessors) {
      const key = accessor(entity);
      if (key === undefined) continue;
      const bucket = this.indexes.get(name);
      if (!bucket) continue;
      let set = bucket.get(key);
      if (!set) { set = new Set<string>(); bucket.set(key, set); }
      set.add(entity.id);
    }
  }

  private unindex(entity: T): void {
    for (const [name, accessor] of this.indexAccessors) {
      const key = accessor(entity);
      if (key === undefined) continue;
      const bucket = this.indexes.get(name);
      if (!bucket) continue;
      const set = bucket.get(key);
      if (set) {
        set.delete(entity.id);
        if (set.size === 0) bucket.delete(key);
      }
    }
  }
}
