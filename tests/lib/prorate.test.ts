import { prorate, prorateBetween, daysBetween } from '../../src/lib/prorate';
import { money } from '../../src/lib/money';

describe('prorate', () => {
  test('full period returns input', () => {
    expect(prorate(money('30', 'USD'), 30, 30).amount).toBe(3000n);
  });

  test('partial period scales by day count', () => {
    expect(prorate(money('30', 'USD'), 15, 30).amount).toBe(1500n);
  });

  test('zero days returns zero', () => {
    expect(prorate(money('30', 'USD'), 0, 30).amount).toBe(0n);
  });

  test('rejects bad totalDays', () => {
    expect(() => prorate(money('30', 'USD'), 1, 0)).toThrow();
  });

  test('daysBetween rounds up partial days', () => {
    expect(daysBetween(0, 86_400_000)).toBe(1);
    expect(daysBetween(0, 86_400_001)).toBe(2);
  });

  test('prorateBetween fraction', () => {
    expect(prorateBetween(money('100', 'USD'), 0, 5000, 10_000).amount).toBe(5000n);
  });
});
