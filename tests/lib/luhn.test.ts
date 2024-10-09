import { isValidLuhn, maskPan, detectBrand } from '../../src/lib/luhn';

describe('luhn', () => {
  test('valid number passes', () => {
    expect(isValidLuhn('4532015112830366')).toBe(true);
  });

  test('invalid number fails', () => {
    expect(isValidLuhn('4532015112830367')).toBe(false);
  });

  test('ignores spaces', () => {
    expect(isValidLuhn('4532 0151 1283 0366')).toBe(true);
  });

  test('maskPan keeps last 4', () => {
    expect(maskPan('4532015112830366')).toBe('************0366');
  });

  test('detectBrand recognises visa / mc / amex', () => {
    expect(detectBrand('4532015112830366')).toBe('visa');
    expect(detectBrand('5500000000000004')).toBe('mastercard');
    expect(detectBrand('340000000000009')).toBe('amex');
  });

  test('short numbers fail', () => {
    expect(isValidLuhn('1')).toBe(false);
  });
});
