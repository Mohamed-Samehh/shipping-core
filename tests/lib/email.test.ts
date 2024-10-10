import { normaliseEmail, isValidEmail, extractDomain, maskEmail, isBlocked, isRoleAddress } from '../../src/lib/email';

describe('email helpers', () => {
  test('normaliseEmail lowercases and trims', () => {
    expect(normaliseEmail(' A@B.COM ')).toBe('a@b.com');
  });

  test('isValidEmail simple cases', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('a.b+c@d.co.uk')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  test('extractDomain', () => {
    expect(extractDomain('a@b.com')).toBe('b.com');
    expect(extractDomain('no-at')).toBeUndefined();
  });

  test('maskEmail keeps first/last char', () => {
    expect(maskEmail('alice@example.com')).toBe('a***e@example.com');
  });

  test('isBlocked uses normalised lookup', () => {
    expect(isBlocked('A@B.com', new Set(['a@b.com']))).toBe(true);
  });

  test('isRoleAddress detects role local parts', () => {
    expect(isRoleAddress('support@b.com')).toBe(true);
    expect(isRoleAddress('alice@b.com')).toBe(false);
  });
});
