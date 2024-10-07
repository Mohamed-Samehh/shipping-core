import { FixedClock, SystemClock } from '../../src/lib/clock';

describe('FixedClock', () => {
  test('now / iso are stable until advanced', () => {
    const c = new FixedClock('2024-10-01T00:00:00Z');
    const t0 = c.now();
    expect(c.iso()).toBe('2024-10-01T00:00:00.000Z');
    c.advance(1000);
    expect(c.now()).toBe(t0 + 1000);
  });

  test('set replaces current time', () => {
    const c = new FixedClock(0);
    c.set('2025-01-01T00:00:00Z');
    expect(c.iso()).toBe('2025-01-01T00:00:00.000Z');
  });

  test('rejects invalid time strings', () => {
    expect(() => new FixedClock('not a date')).toThrow();
  });

  test('rejects non-finite advance ms', () => {
    const c = new FixedClock(0);
    expect(() => c.advance(Infinity)).toThrow();
  });

  test('accepts Date in constructor', () => {
    const d = new Date('2024-12-31T23:59:59Z');
    const c = new FixedClock(d);
    expect(c.now()).toBe(d.getTime());
  });
});

describe('SystemClock', () => {
  test('produces an iso-shaped string', () => {
    const c = new SystemClock();
    expect(c.iso()).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
