import { money, zero, plus, minus, times, negate, abs, compare, equal, sum, format, allocate, allocateWeighted, isPositive, isNegative, isZero } from '../../src/lib/money';
import { CurrencyMismatchError } from '../../src/errors';

describe('money primitives', () => {
  test('money from number rounds to minor units', () => {
    expect(money(1.235, 'USD').amount).toBe(124n);
  });

  test('money from string preserves precision', () => {
    expect(money('10.20', 'USD').amount).toBe(1020n);
  });

  test('money from bigint takes minor units literally', () => {
    expect(money(199n, 'USD').amount).toBe(199n);
  });

  test('JPY has zero minor units', () => {
    expect(money('1000', 'JPY').amount).toBe(1000n);
  });

  test('plus and minus require same currency', () => {
    expect(plus(money('1', 'USD'), money('2', 'USD')).amount).toBe(300n);
    expect(() => plus(money('1', 'USD'), money('2', 'EUR'))).toThrow(CurrencyMismatchError);
    expect(minus(money('5', 'USD'), money('1', 'USD')).amount).toBe(400n);
  });

  test('times with integer factor', () => {
    expect(times(money('2', 'USD'), 3).amount).toBe(600n);
  });

  test('times with fractional factor', () => {
    expect(times(money('1', 'USD'), 0.1).amount).toBe(10n);
  });

  test('negate / abs / sign predicates', () => {
    expect(negate(money('1', 'USD')).amount).toBe(-100n);
    expect(abs(money('-1', 'USD')).amount).toBe(100n);
    expect(isPositive(money('1', 'USD'))).toBe(true);
    expect(isNegative(money('-1', 'USD'))).toBe(true);
    expect(isZero(money('0', 'USD'))).toBe(true);
  });

  test('compare and equal', () => {
    expect(compare(money('1', 'USD'), money('2', 'USD'))).toBe(-1);
    expect(equal(money('1', 'USD'), money('1', 'USD'))).toBe(true);
  });

  test('sum of empty array needs currency hint', () => {
    expect(sum([], 'USD').amount).toBe(0n);
    expect(() => sum([])).toThrow();
  });

  test('format produces fixed-point string', () => {
    expect(format(money('1.5', 'USD'))).toBe('1.50');
    expect(format(money('1', 'USD'), { withSymbol: true })).toBe('$1.00');
  });

  test('allocate distributes pennies left-to-right', () => {
    const parts = allocate(money('1', 'USD'), 3);
    expect(parts.map((p) => p.amount)).toEqual([34n, 33n, 33n]);
  });

  test('allocateWeighted preserves total', () => {
    const parts = allocateWeighted(money('10', 'USD'), [1, 2, 3]);
    const total = parts.reduce((acc, p) => acc + p.amount, 0n);
    expect(total).toBe(1000n);
  });

  test('zero returns zero amount in currency', () => {
    expect(zero('USD').amount).toBe(0n);
  });
});
