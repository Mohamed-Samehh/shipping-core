// In-process LRU and TTL caches used to short-circuit repeated rate lookups,
// label re-renders and tracking polls. Both expose hit / miss counters so
// callers can publish them as metrics.

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

export class LruCache<K, V> {
  private readonly map = new Map<K, V>();
  private hits = 0;
  private misses = 0;

  constructor(private readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError('capacity must be a positive integer');
    }
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      this.misses += 1;
      return undefined;
    }
    const value = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, value);
    this.hits += 1;
    return value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    while (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value as K;
      this.map.delete(oldest);
    }
  }

  delete(key: K): boolean { return this.map.delete(key); }
  has(key: K): boolean { return this.map.has(key); }
  clear(): void { this.map.clear(); this.hits = 0; this.misses = 0; }
  size(): number { return this.map.size; }
  stats(): CacheStats { return { hits: this.hits, misses: this.misses, size: this.map.size }; }
}

export class TtlCache<K, V> {
  private readonly entries = new Map<K, { value: V; expiresAt: number }>();
  private hits = 0;
  private misses = 0;

  constructor(private readonly defaultTtlMs: number, private readonly now: () => number = Date.now) {
    if (defaultTtlMs <= 0) throw new RangeError('defaultTtlMs must be > 0');
  }

  get(key: K): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      this.misses += 1;
      return undefined;
    }
    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return entry.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTtlMs;
    this.entries.set(key, { value, expiresAt: this.now() + ttl });
  }

  delete(key: K): boolean { return this.entries.delete(key); }
  clear(): void { this.entries.clear(); this.hits = 0; this.misses = 0; }
  size(): number { return this.entries.size; }
  stats(): CacheStats { return { hits: this.hits, misses: this.misses, size: this.entries.size }; }
}
