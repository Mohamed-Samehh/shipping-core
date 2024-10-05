import { weight, toUnit, addWeight, subtractWeight, compareWeight, formatWeight, sumWeights, maxWeight } from '../../src/lib/weight';

describe('weight', () => {
  test('constructs in g/kg/oz/lb', () => {
    expect(weight(1, 'kg').grams).toBeCloseTo(1000);
    expect(weight(1, 'lb').grams).toBeCloseTo(453.592);
    expect(weight(16, 'oz').grams).toBeCloseTo(453.592, 1);
  });

  test('rejects negative', () => {
    expect(() => weight(-1, 'g')).toThrow();
  });

  test('toUnit roundtrips', () => {
    expect(toUnit(weight(1, 'kg'), 'kg')).toBeCloseTo(1);
    expect(toUnit(weight(1, 'kg'), 'g')).toBeCloseTo(1000);
  });

  test('add / subtract', () => {
    expect(addWeight(weight(100), weight(200)).grams).toBe(300);
    expect(subtractWeight(weight(300), weight(100)).grams).toBe(200);
  });

  test('subtract underflow throws', () => {
    expect(() => subtractWeight(weight(1), weight(2))).toThrow();
  });

  test('compareWeight', () => {
    expect(compareWeight(weight(1), weight(2))).toBe(-1);
    expect(compareWeight(weight(2), weight(2))).toBe(0);
  });

  test('formatWeight', () => {
    expect(formatWeight(weight(1500, 'g'), 'kg', 2)).toBe('1.50 kg');
  });

  test('sumWeights and maxWeight', () => {
    expect(sumWeights([weight(1), weight(2), weight(3)]).grams).toBe(6);
    expect(maxWeight([weight(1), weight(5), weight(3)]).grams).toBe(5);
  });
});
