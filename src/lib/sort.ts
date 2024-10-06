// Stable multi-key sort utilities used by repository listing helpers.

export type CompareFn<T> = (a: T, b: T) => number;

export function stableSort<T>(items: readonly T[], compare: CompareFn<T>): T[] {
  const indexed = items.map((item, index) => ({ item, index }));
  indexed.sort((a, b) => compare(a.item, b.item) || a.index - b.index);
  return indexed.map(({ item }) => item);
}

export function compareBy<T>(...keys: ReadonlyArray<(item: T) => string | number | undefined>): CompareFn<T> {
  return (a, b) => {
    for (const key of keys) {
      const av = key(a);
      const bv = key(b);
      if (av === bv) continue;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      if (av < bv) return -1;
      if (av > bv) return 1;
    }
    return 0;
  };
}

export function descending<T>(compare: CompareFn<T>): CompareFn<T> {
  return (a, b) => -compare(a, b);
}

export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}
