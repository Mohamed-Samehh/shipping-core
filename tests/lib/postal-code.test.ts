import { isValidPostalCode, normalisePostalCode, supportedCountries } from '../../src/lib/postal-code';

describe('postal code', () => {
  test('US zip', () => {
    expect(isValidPostalCode('US', '94103')).toBe(true);
    expect(isValidPostalCode('US', '94103-1234')).toBe(true);
    expect(isValidPostalCode('US', '941')).toBe(false);
  });

  test('CA postal', () => {
    expect(isValidPostalCode('CA', 'K1A 0B1')).toBe(true);
    expect(isValidPostalCode('CA', 'K1A0B1')).toBe(true);
    expect(isValidPostalCode('CA', '12345')).toBe(false);
  });

  test('unknown country falls back to length check', () => {
    expect(isValidPostalCode('XX', '12345')).toBe(true);
    expect(isValidPostalCode('XX', '')).toBe(false);
  });

  test('normalisePostalCode CA inserts space', () => {
    expect(normalisePostalCode('CA', 'K1A0B1')).toBe('K1A 0B1');
  });

  test('normalisePostalCode BR inserts hyphen', () => {
    expect(normalisePostalCode('BR', '12345678')).toBe('12345-678');
  });

  test('supportedCountries lists known sets', () => {
    expect(supportedCountries()).toContain('US');
  });
});
