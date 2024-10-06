import { parseDiscount, isDiscountActive } from '../../src/domain/discount';

const base = {
  id: 'd1', customerId: 'cu1', kind: 'percentage' as const,
  code: 'SAVE10', basisPoints: 1000, tiers: [],
  effectiveAt: 100, enabled: true, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Discount schema', () => {
  test('parseDiscount accepts a valid record', () => {
    expect(parseDiscount(base).code).toBe('SAVE10');
  });

  test('isDiscountActive when in window and enabled', () => {
    expect(isDiscountActive(parseDiscount(base), 200)).toBe(true);
    expect(isDiscountActive(parseDiscount({ ...base, enabled: false }), 200)).toBe(false);
    expect(isDiscountActive(parseDiscount({ ...base, effectiveAt: 500 }), 200)).toBe(false);
    expect(isDiscountActive(parseDiscount({ ...base, expiresAt: 100 }), 200)).toBe(false);
  });

  test('tiered weight discounts accept the tier list', () => {
    const d = parseDiscount({ ...base, kind: 'tiered_weight',
      tiers: [{ minWeightG: 0, basisPoints: 500 }, { minWeightG: 5000, basisPoints: 1000 }] });
    expect(d.tiers).toHaveLength(2);
  });
});
