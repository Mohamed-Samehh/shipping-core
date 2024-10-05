import { isValidIban, formatIban, normaliseIban } from '../../src/lib/iban';

describe('iban', () => {
  test('valid German IBAN', () => {
    expect(isValidIban('DE89 3704 0044 0532 0130 00')).toBe(true);
  });

  test('invalid checksum is rejected', () => {
    expect(isValidIban('DE89 3704 0044 0532 0130 01')).toBe(false);
  });

  test('unknown country is rejected', () => {
    expect(isValidIban('XY12345')).toBe(false);
  });

  test('format groups every 4 chars', () => {
    expect(formatIban('DE89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
  });

  test('normaliseIban removes whitespace and uppercases', () => {
    expect(normaliseIban(' de89 3704 ')).toBe('DE893704');
  });

  test('valid Dutch IBAN', () => {
    expect(isValidIban('NL91 ABNA 0417 1643 00')).toBe(true);
  });
});
