import { groupBy, keyBy, countBy, partition, uniqueBy, chunk } from '../../src/lib/group';

describe('group helpers', () => {
  test('groupBy buckets by derived key', () => {
    const g = groupBy([1, 2, 3, 4], (n) => n % 2);
    expect(g.get(0)).toEqual([2, 4]);
    expect(g.get(1)).toEqual([1, 3]);
  });

  test('keyBy maps by key', () => {
    const m = keyBy([{ id: 'a' }, { id: 'b' }], (x) => x.id);
    expect(m.get('a')?.id).toBe('a');
  });

  test('countBy counts occurrences', () => {
    expect(countBy(['a', 'a', 'b'], (x) => x).get('a')).toBe(2);
  });

  test('partition splits by predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4], (n) => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3]);
  });

  test('uniqueBy keeps first occurrence', () => {
    expect(uniqueBy([{ k: 1 }, { k: 1 }, { k: 2 }], (x) => x.k).length).toBe(2);
  });

  test('chunk splits into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('chunk rejects zero size', () => {
    expect(() => chunk([1], 0)).toThrow();
  });
});
