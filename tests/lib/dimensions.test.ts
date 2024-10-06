import { dimensions, girth, lengthPlusGirth, volumeMm3, longestSide, toUnit, isOversize } from '../../src/lib/dimensions';

describe('dimensions', () => {
  test('rejects non-positive sides', () => {
    expect(() => dimensions(0, 1, 1)).toThrow();
    expect(() => dimensions(1, -1, 1)).toThrow();
  });

  test('converts cm / in into mm', () => {
    expect(dimensions(10, 5, 3, 'cm').lengthMm).toBe(100);
    expect(dimensions(1, 1, 1, 'in').lengthMm).toBeCloseTo(25.4);
  });

  test('girth = 2 * (w + h)', () => {
    expect(girth(dimensions(100, 50, 30))).toBe(160);
  });

  test('lengthPlusGirth', () => {
    expect(lengthPlusGirth(dimensions(100, 50, 30))).toBe(260);
  });

  test('volumeMm3 is l*w*h', () => {
    expect(volumeMm3(dimensions(10, 5, 2))).toBe(100);
  });

  test('longestSide picks max', () => {
    expect(longestSide(dimensions(10, 100, 50))).toBe(100);
  });

  test('toUnit converts back', () => {
    const out = toUnit(dimensions(100, 50, 30), 'cm');
    expect(out).toEqual({ length: 10, width: 5, height: 3 });
  });

  test('isOversize threshold', () => {
    const d = dimensions(2750, 100, 100);
    expect(isOversize(d, 2740, 9999)).toBe(true);
  });
});
