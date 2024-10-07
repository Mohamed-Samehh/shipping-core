// Lookup helpers built around iteration patterns the services repeat: keying
// a list by an id, grouping by a derived value, partitioning by a predicate.

export function groupBy<T, K extends string | number>(items: readonly T[],
  key: (item: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    let bucket = out.get(k);
    if (!bucket) { bucket = []; out.set(k, bucket); }
    bucket.push(item);
  }
  return out;
}

export function keyBy<T, K extends string | number>(items: readonly T[],
  key: (item: T) => K): Map<K, T> {
  const out = new Map<K, T>();
  for (const item of items) out.set(key(item), item);
  return out;
}

export function countBy<T, K extends string | number>(items: readonly T[],
  key: (item: T) => K): Map<K, number> {
  const out = new Map<K, number>();
  for (const item of items) {
    const k = key(item);
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
}

export function partition<T>(items: readonly T[],
  predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const item of items) (predicate(item) ? truthy : falsy).push(item);
  return [truthy, falsy];
}

export function uniqueBy<T, K extends string | number>(items: readonly T[],
  key: (item: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be positive int');
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
