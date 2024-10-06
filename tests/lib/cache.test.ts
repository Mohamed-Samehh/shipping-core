import { LruCache, TtlCache } from '../../src/lib/cache';

describe('LruCache', () => {
  test('evicts least-recently-used entry', () => {
    const c = new LruCache<string, number>(2);
    c.set('a', 1);
    c.set('b', 2);
    c.get('a');
    c.set('c', 3);
    expect(c.has('b')).toBe(false);
    expect(c.has('a')).toBe(true);
    expect(c.has('c')).toBe(true);
  });

  test('tracks hits and misses', () => {
    const c = new LruCache<string, number>(2);
    c.set('a', 1);
    c.get('a');
    c.get('b');
    expect(c.stats().hits).toBe(1);
    expect(c.stats().misses).toBe(1);
  });

  test('rejects zero capacity', () => {
    expect(() => new LruCache(0)).toThrow();
  });

  test('clear resets size and counters', () => {
    const c = new LruCache<string, number>(2);
    c.set('a', 1);
    c.clear();
    expect(c.size()).toBe(0);
    expect(c.stats().hits).toBe(0);
  });
});

describe('TtlCache', () => {
  test('expires entries after ttl', () => {
    let now = 1000;
    const c = new TtlCache<string, number>(100, () => now);
    c.set('a', 1);
    expect(c.get('a')).toBe(1);
    now += 200;
    expect(c.get('a')).toBeUndefined();
  });

  test('rejects non-positive default ttl', () => {
    expect(() => new TtlCache(0)).toThrow();
  });
});
