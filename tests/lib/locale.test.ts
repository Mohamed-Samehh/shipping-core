import { formatMoney, formatNumber, formatDate, formatDateTime } from '../../src/lib/locale';
import { money } from '../../src/lib/money';

describe('locale formatting', () => {
  test('formatMoney USD', () => {
    expect(formatMoney(money('12.34', 'USD'), 'en-US')).toContain('12.34');
  });

  test('formatMoney JPY has no decimals', () => {
    expect(formatMoney(money('1000', 'JPY'), 'en-US')).toContain('1,000');
  });

  test('formatNumber with thousands', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  test('formatDate medium style', () => {
    expect(formatDate(Date.parse('2024-10-15T00:00:00Z'), 'en-US')).toContain('2024');
  });

  test('formatDateTime includes time', () => {
    const formatted = formatDateTime(Date.parse('2024-10-15T12:00:00Z'), 'en-US');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(5);
  });
});
