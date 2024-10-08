import { TokenBucketLimiter, FixedWindowLimiter } from '../../src/lib/rate-limit';

describe('TokenBucketLimiter', () => {
  test('allows consumption up to capacity', () => {
    let now = 0;
    const rl = new TokenBucketLimiter(5, 1, () => now);
    for (let i = 0; i < 5; i++) expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(false);
  });

  test('refills over time', () => {
    let now = 0;
    const rl = new TokenBucketLimiter(2, 1, () => now);
    expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(false);
    now = 1500;
    expect(rl.consume('k')).toBe(true);
  });

  test('rejects invalid capacity', () => {
    expect(() => new TokenBucketLimiter(0, 1)).toThrow();
  });

  test('remaining returns integer count', () => {
    const rl = new TokenBucketLimiter(3, 1, () => 0);
    expect(Number.isInteger(rl.remaining('k'))).toBe(true);
  });
});

describe('FixedWindowLimiter', () => {
  test('allows up to limit per window', () => {
    let now = 0;
    const rl = new FixedWindowLimiter(3, 1000, () => now);
    expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(true);
    expect(rl.consume('k')).toBe(false);
  });

  test('window resets after windowMs', () => {
    let now = 0;
    const rl = new FixedWindowLimiter(2, 1000, () => now);
    rl.consume('k');
    rl.consume('k');
    now += 1500;
    expect(rl.consume('k')).toBe(true);
  });

  test('remaining matches limit before any consumption', () => {
    const rl = new FixedWindowLimiter(5, 1000, () => 0);
    expect(rl.remaining('k')).toBe(5);
  });
});
