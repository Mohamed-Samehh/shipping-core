import { shallowDiff, deepEqual, diffIsEmpty } from '../../src/lib/diff';

describe('diff helpers', () => {
  test('shallowDiff reports add/remove/change', () => {
    const d = shallowDiff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 });
    expect(d.added).toEqual({ c: 4 });
    expect(d.changed).toEqual({ b: { before: 2, after: 3 } });
    expect(d.removed).toEqual({});
  });

  test('deepEqual for arrays', () => {
    expect(deepEqual([1, [2]], [1, [2]])).toBe(true);
    expect(deepEqual([1, [2]], [1, [3]])).toBe(false);
  });

  test('deepEqual for objects', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  test('diffIsEmpty when no fields differ', () => {
    expect(diffIsEmpty(shallowDiff({ a: 1 }, { a: 1 }))).toBe(true);
  });

  test('shallowDiff reports removals', () => {
    const d = shallowDiff({ a: 1, b: 2 }, { a: 1 });
    expect(d.removed).toEqual({ b: 2 });
  });
});
