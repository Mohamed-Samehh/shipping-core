import { normalisePhone, isE164, countryCode, maskPhone, formatNational } from '../../src/lib/phone';

describe('phone helpers', () => {
  test('normalisePhone strips formatting', () => {
    expect(normalisePhone('+1 (555) 123-4567')).toBe('+15551234567');
  });

  test('normalisePhone converts 00 prefix', () => {
    expect(normalisePhone('00 44 7700 900000')).toBe('+447700900000');
  });

  test('isE164 detects format', () => {
    expect(isE164('+15551234567')).toBe(true);
    expect(isE164('15551234567')).toBe(false);
  });

  test('countryCode extracts the digits', () => {
    expect(countryCode('+15551234567')).toBe('1');
  });

  test('maskPhone keeps last N digits', () => {
    expect(maskPhone('+15551234567', 4)).toBe('+*******4567');
  });

  test('formatNational for US numbers', () => {
    expect(formatNational('+15551234567')).toBe('(555) 123-4567');
  });
});
