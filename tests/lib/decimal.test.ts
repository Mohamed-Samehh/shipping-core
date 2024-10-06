import { decimal, rescale, dadd, dsub, dmul, ddiv, decimalToString } from '../../src/lib/decimal';

describe('decimal', () => {
  test('decimal from string preserves precision', () => {
    const d = decimal('12.345', 4);
    expect(decimalToString(d)).toBe('12.3450');
  });

  test('rescale half-even rounding', () => {
    expect(decimalToString(rescale(decimal('2.5', 0), 0))).toBe('2');
    expect(decimalToString(rescale(decimal('3.5', 0), 0))).toBe('4');
  });

  test('dadd and dsub align scales', () => {
    expect(decimalToString(dadd(decimal('1.5', 2), decimal('0.25', 4)))).toBe('1.7500');
    expect(decimalToString(dsub(decimal('1.5', 2), decimal('0.25', 4)))).toBe('1.2500');
  });

  test('dmul multiplies', () => {
    expect(decimalToString(dmul(decimal('1.5', 4), decimal('2', 0)))).toBe('3.0000');
  });

  test('ddiv divides with target scale', () => {
    expect(decimalToString(ddiv(decimal('10', 4), decimal('4', 4)))).toBe('2.5000');
  });

  test('ddiv rejects zero', () => {
    expect(() => ddiv(decimal(1), decimal(0))).toThrow();
  });

  test('decimal from bigint scales up', () => {
    expect(decimalToString(decimal(5n, 2))).toBe('5.00');
  });

  test('rejects non-finite', () => {
    expect(() => decimal(Infinity)).toThrow();
  });
});
