import { parseRate, isRateExpired, rateSubtotal } from '../../src/domain/rate';

const base = {
  id: 'rt_1', shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1',
  amount: 1099n, currency: 'USD', baseAmount: 999n,
  surchargesAmount: 100n, discountAmount: 0n, taxAmount: 0n,
  estimatedTransitDays: 3, expiresAt: 1_000_000, metadata: {},
  createdAt: 0,
};

describe('Rate schema', () => {
  test('parseRate accepts a valid record', () => {
    expect(parseRate(base).amount).toBe(1099n);
  });

  test('isRateExpired when expiresAt <= now', () => {
    expect(isRateExpired(parseRate(base), 2_000_000)).toBe(true);
    expect(isRateExpired(parseRate(base), 500_000)).toBe(false);
  });

  test('subtotal sums components', () => {
    expect(rateSubtotal(parseRate(base))).toBe(1099n);
  });

  test('rejects bad currency length', () => {
    expect(() => parseRate({ ...base, currency: 'USDollars' })).toThrow();
  });
});
