import { stableSort, compareBy, descending, naturalCompare } from '../../src/lib/sort';

describe('sort helpers', () => {
  test('stableSort preserves order on equal keys', () => {
    const xs = [{ k: 1, i: 'a' }, { k: 1, i: 'b' }, { k: 0, i: 'c' }];
    const out = stableSort(xs, (a, b) => a.k - b.k);
    expect(out.map((x) => x.i)).toEqual(['c', 'a', 'b']);
  });

  test('compareBy chains multiple keys', () => {
    const cmp = compareBy<{ a: number; b: number }>((x) => x.a, (x) => x.b);
    expect(cmp({ a: 1, b: 1 }, { a: 1, b: 2 })).toBe(-1);
  });

  test('descending inverts compare', () => {
    const asc = (a: number, b: number) => a - b;
    const desc = descending(asc);
    expect([3, 1, 2].slice().sort(desc)).toEqual([3, 2, 1]);
  });

  test('naturalCompare orders by numeric chunks', () => {
    expect(['file10', 'file2'].sort(naturalCompare)).toEqual(['file2', 'file10']);
  });

  test('compareBy treats undefined as largest', () => {
    const cmp = compareBy<{ x?: number }>((x) => x.x);
    expect(cmp({ x: 1 }, {})).toBe(-1);
  });
});
