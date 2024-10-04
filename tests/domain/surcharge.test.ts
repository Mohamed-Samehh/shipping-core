import { parseSurcharge, isSurchargeActive, isPercentageSurcharge } from '../../src/domain/surcharge';

const base = {
  id: 'sch_1', carrierId: 'c1', kind: 'fuel' as const,
  code: 'FUEL', name: 'Fuel surcharge',
  basisPoints: 1500, effectiveAt: 100,
  enabled: true, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Surcharge schema', () => {
  test('parseSurcharge accepts a valid record', () => {
    expect(parseSurcharge(base).code).toBe('FUEL');
  });

  test('isPercentageSurcharge when basisPoints set', () => {
    expect(isPercentageSurcharge(parseSurcharge(base))).toBe(true);
    const flat = parseSurcharge({ ...base, basisPoints: undefined,
      flatAmount: 100n, flatCurrency: 'USD' });
    expect(isPercentageSurcharge(flat)).toBe(false);
  });

  test('isSurchargeActive within window and enabled', () => {
    expect(isSurchargeActive(parseSurcharge(base), 200)).toBe(true);
    expect(isSurchargeActive(parseSurcharge({ ...base, enabled: false }), 200)).toBe(false);
    expect(isSurchargeActive(parseSurcharge({ ...base, effectiveAt: 500 }), 200)).toBe(false);
    expect(isSurchargeActive(parseSurcharge({ ...base, expiresAt: 50 }), 200)).toBe(false);
  });

  test('rejects unknown kind', () => {
    expect(() => parseSurcharge({ ...base, kind: 'magic' as never })).toThrow();
  });
});
