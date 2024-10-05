import { currencyInfo, isKnownCurrency, listCurrencies, minorUnits } from '../../src/lib/currency';

describe('currency table', () => {
  test('USD has 2 minor units', () => {
    expect(currencyInfo('USD').minorUnits).toBe(2);
  });

  test('JPY has 0 minor units', () => {
    expect(minorUnits('JPY')).toBe(0);
  });

  test('case insensitive', () => {
    expect(currencyInfo('usd').code).toBe('USD');
  });

  test('rejects unknown', () => {
    expect(() => currencyInfo('xxx')).toThrow();
  });

  test('isKnownCurrency boolean check', () => {
    expect(isKnownCurrency('USD')).toBe(true);
    expect(isKnownCurrency('xxx')).toBe(false);
  });

  test('listCurrencies returns a non-empty array', () => {
    expect(listCurrencies().length).toBeGreaterThan(5);
  });
});
