import { limitsFor, validate, isUsable, supportedCarriers } from '../../src/lib/carrier-rules';
import { dimensions } from '../../src/lib/dimensions';
import { weight } from '../../src/lib/weight';

describe('carrier-rules', () => {
  test('limitsFor returns known carrier', () => {
    expect(limitsFor('UPS').maxWeightG).toBe(70_000);
  });

  test('limitsFor rejects unknown carrier', () => {
    expect(() => limitsFor('XYZ')).toThrow();
  });

  test('validate flags overweight', () => {
    const dim = dimensions(300, 200, 100, 'mm');
    const w = weight(80, 'kg');
    const failures = validate('UPS', dim, w, 0n);
    expect(failures.some((f) => f.code === 'WEIGHT_TOO_HEAVY')).toBe(true);
  });

  test('validate flags oversize length', () => {
    const dim = dimensions(3000, 100, 100, 'mm');
    const w = weight(1, 'kg');
    expect(validate('UPS', dim, w, 0n).some((f) => f.code === 'DIMENSION_TOO_LONG')).toBe(true);
  });

  test('validate flags declared value cap', () => {
    const dim = dimensions(300, 200, 100, 'mm');
    const w = weight(1, 'kg');
    expect(validate('USPS', dim, w, 10_000_00n).some((f) => f.code === 'DECLARED_VALUE_TOO_HIGH')).toBe(true);
  });

  test('isUsable returns true within limits', () => {
    expect(isUsable('UPS', dimensions(300, 200, 100, 'mm'), weight(1, 'kg'))).toBe(true);
  });

  test('supportedCarriers includes UPS / FEDEX / USPS / DHL', () => {
    const carriers = supportedCarriers();
    for (const c of ['UPS', 'FEDEX', 'USPS', 'DHL']) {
      expect(carriers).toContain(c);
    }
  });
});
