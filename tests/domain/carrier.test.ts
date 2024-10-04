import { parseCarrier, isCarrierEnabled, supportsCountry } from '../../src/domain/carrier';

const base = {
  id: 'car_1', code: 'UPS', name: 'United Parcel Service',
  mode: 'parcel' as const, enabled: true, supportedCountries: ['US', 'CA'],
  supportsCustoms: false, supportsHazmat: false, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Carrier schema', () => {
  test('parseCarrier accepts a valid record', () => {
    expect(parseCarrier(base).code).toBe('UPS');
  });

  test('rejects unknown mode', () => {
    expect(() => parseCarrier({ ...base, mode: 'air' as never })).toThrow();
  });

  test('rejects empty supportedCountries', () => {
    expect(() => parseCarrier({ ...base, supportedCountries: [] })).toThrow();
  });

  test('isCarrierEnabled honours the flag', () => {
    expect(isCarrierEnabled(parseCarrier(base))).toBe(true);
    expect(isCarrierEnabled(parseCarrier({ ...base, enabled: false }))).toBe(false);
  });

  test('supportsCountry is case-insensitive', () => {
    expect(supportsCountry(parseCarrier(base), 'us')).toBe(true);
    expect(supportsCountry(parseCarrier(base), 'XX')).toBe(false);
  });

  test('rejects code shorter than 2 chars', () => {
    expect(() => parseCarrier({ ...base, code: 'X' })).toThrow();
  });
});
