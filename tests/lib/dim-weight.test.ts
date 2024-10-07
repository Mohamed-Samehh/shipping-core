import { dimensionalWeight, billableWeight, dimRatio, exceedsDim } from '../../src/lib/dim-weight';
import { dimensions } from '../../src/lib/dimensions';
import { weight } from '../../src/lib/weight';

describe('dim weight', () => {
  test('dimensionalWeight = volumeCm3 / dimFactor', () => {
    const d = dimensions(40, 30, 20, 'cm'); // 24,000 cm3
    const dw = dimensionalWeight(d, 6000); // 4 kg
    expect(dw.grams).toBeCloseTo(4000);
  });

  test('billableWeight uses larger of actual and dim', () => {
    const d = dimensions(40, 30, 20, 'cm');
    expect(billableWeight(d, weight(5, 'kg'), 6000).grams).toBeCloseTo(5000);
    expect(billableWeight(d, weight(1, 'kg'), 6000).grams).toBeCloseTo(4000);
  });

  test('dimRatio for actual=0 is Infinity', () => {
    const d = dimensions(40, 30, 20, 'cm');
    expect(dimRatio(d, weight(0), 6000)).toBe(Infinity);
  });

  test('exceedsDim flags larger volumetric', () => {
    const d = dimensions(40, 30, 20, 'cm');
    expect(exceedsDim(d, weight(1, 'kg'), 6000)).toBe(true);
    expect(exceedsDim(d, weight(10, 'kg'), 6000)).toBe(false);
  });

  test('rejects non-positive dimFactor', () => {
    expect(() => dimensionalWeight(dimensions(1, 1, 1), 0)).toThrow();
  });
});
