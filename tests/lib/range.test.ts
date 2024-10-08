import { range, contains, overlaps, intersection, iterate, size, clamp } from '../../src/lib/range';

describe('range helpers', () => {
  test('range checks bounds', () => {
    expect(() => range(5, 3)).toThrow();
    expect(() => range(1.5, 3)).toThrow();
  });

  test('contains uses half-open semantics', () => {
    const r = range(0, 5);
    expect(contains(r, 0)).toBe(true);
    expect(contains(r, 5)).toBe(false);
  });

  test('overlaps detects partial intersection', () => {
    expect(overlaps(range(0, 5), range(4, 10))).toBe(true);
    expect(overlaps(range(0, 5), range(5, 10))).toBe(false);
  });

  test('intersection returns shared sub-range', () => {
    expect(intersection(range(0, 5), range(3, 10))).toEqual({ start: 3, end: 5 });
    expect(intersection(range(0, 5), range(5, 10))).toBeUndefined();
  });

  test('iterate yields integers in [start, end)', () => {
    expect([...iterate(range(2, 5))]).toEqual([2, 3, 4]);
  });

  test('size returns element count', () => {
    expect(size(range(2, 5))).toBe(3);
  });

  test('clamp pins value to inclusive bounds', () => {
    expect(clamp(10, range(0, 5))).toBe(4);
    expect(clamp(-1, range(0, 5))).toBe(0);
  });
});
