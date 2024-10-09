import { countryInfo, isKnownCountry, isEuMember, requiresCustoms, listCountries } from '../../src/lib/country';

describe('country table', () => {
  test('US lookup', () => {
    expect(countryInfo('us').code).toBe('US');
    expect(countryInfo('US').currency).toBe('USD');
  });

  test('rejects unknown', () => {
    expect(() => countryInfo('XX')).toThrow();
  });

  test('isEuMember', () => {
    expect(isEuMember('DE')).toBe(true);
    expect(isEuMember('US')).toBe(false);
  });

  test('intra-EU shipments do not require customs', () => {
    expect(requiresCustoms('DE', 'FR')).toBe(false);
  });

  test('cross-border domestic does not require customs', () => {
    expect(requiresCustoms('US', 'US')).toBe(false);
  });

  test('UK / EU requires customs', () => {
    expect(requiresCustoms('GB', 'DE')).toBe(true);
  });

  test('listCountries returns full set', () => {
    expect(listCountries().length).toBeGreaterThan(15);
  });
});
