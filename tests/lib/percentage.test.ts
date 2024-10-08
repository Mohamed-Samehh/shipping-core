import { fromPercent, toPercent, applyBps, markup, discount, compound, clampBps } from '../../src/lib/percentage';
import { money } from '../../src/lib/money';

describe('basis-point helpers', () => {
  test('fromPercent / toPercent roundtrip', () => {
    expect(toPercent(fromPercent(7.5))).toBe(7.5);
  });

  test('applyBps multiplies money by bps/10000', () => {
    expect(applyBps(money('100', 'USD'), 500).amount).toBe(500n);
  });

  test('markup adds the bps share', () => {
    expect(markup(money('100', 'USD'), 1000).amount).toBe(11000n);
  });

  test('discount subtracts the bps share', () => {
    expect(discount(money('100', 'USD'), 1000).amount).toBe(9000n);
  });

  test('compound steps multiplicatively', () => {
    expect(compound([1000, 1000])).toBe(2100);
  });

  test('clampBps respects bounds', () => {
    expect(clampBps(-1)).toBe(0);
    expect(clampBps(2_000_000)).toBe(1_000_000);
    expect(clampBps(500)).toBe(500);
  });
});
