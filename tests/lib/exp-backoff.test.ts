import { expBackoff } from '../../src/lib/exp-backoff';

describe('expBackoff', () => {
  test('none jitter grows by factor', () => {
    const opts = { initialDelayMs: 100, factor: 2, maxDelayMs: 10_000 };
    expect(expBackoff(1, opts)).toBe(100);
    expect(expBackoff(2, opts)).toBe(200);
    expect(expBackoff(3, opts)).toBe(400);
  });

  test('respects max cap', () => {
    const opts = { initialDelayMs: 100, factor: 10, maxDelayMs: 500 };
    expect(expBackoff(5, opts)).toBe(500);
  });

  test('full jitter is in [0, base]', () => {
    const opts = { initialDelayMs: 100, factor: 2, maxDelayMs: 10_000,
      jitter: 'full' as const, random: () => 0.5 };
    expect(expBackoff(3, opts)).toBe(200);
  });

  test('equal jitter is in [base/2, base]', () => {
    const opts = { initialDelayMs: 100, factor: 2, maxDelayMs: 10_000,
      jitter: 'equal' as const, random: () => 0.5 };
    expect(expBackoff(3, opts)).toBe(300);
  });

  test('decorrelated derives from previous', () => {
    const opts = { initialDelayMs: 100, factor: 2, maxDelayMs: 10_000,
      jitter: 'decorrelated' as const, random: () => 0 };
    expect(expBackoff(1, opts, 200)).toBe(100);
  });

  test('rejects bad inputs', () => {
    expect(() => expBackoff(0, { initialDelayMs: 1, factor: 2, maxDelayMs: 10 })).toThrow();
    expect(() => expBackoff(1, { initialDelayMs: 1, factor: 0.5, maxDelayMs: 10 })).toThrow();
  });
});
