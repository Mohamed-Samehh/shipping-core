import { parseInsurance, isInsuranceActive } from '../../src/domain/insurance';

const base = {
  id: 'ins_1', shipmentId: 'sh1',
  provider: 'carrier' as const,
  coverageAmount: 100000n, coverageCurrency: 'USD',
  premiumAmount: 100n, premiumCurrency: 'USD',
  effectiveAt: 100, expiresAt: 1000,
  metadata: {}, createdAt: 0,
};

describe('Insurance schema', () => {
  test('parseInsurance accepts a valid record', () => {
    expect(parseInsurance(base).provider).toBe('carrier');
  });

  test('isInsuranceActive within window', () => {
    expect(isInsuranceActive(parseInsurance(base), 500)).toBe(true);
    expect(isInsuranceActive(parseInsurance(base), 50)).toBe(false);
    expect(isInsuranceActive(parseInsurance(base), 2000)).toBe(false);
  });

  test('rejects bad provider', () => {
    expect(() => parseInsurance({ ...base, provider: 'self-insure' as never })).toThrow();
  });
});
