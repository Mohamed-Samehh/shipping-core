import { createUlidFactory, isUlid } from '../../src/lib/ulid';

describe('ULID factory', () => {
  test('produces 26-char ulids', () => {
    const f = createUlidFactory(() => 1700000000000, () => 0.5);
    expect(f.next().length).toBe(26);
  });

  test('monotonic within same millisecond', () => {
    const f = createUlidFactory(() => 1700000000000, () => 0.5);
    const a = f.next();
    const b = f.next();
    expect(b > a).toBe(true);
  });

  test('time-prefix sorts by time', () => {
    let t = 1700000000000;
    const f = createUlidFactory(() => t, () => 0);
    const a = f.next();
    t += 1000;
    const b = f.next();
    expect(b > a).toBe(true);
  });

  test('isUlid validates length and alphabet', () => {
    const f = createUlidFactory(() => 1700000000000, () => 0);
    expect(isUlid(f.next())).toBe(true);
    expect(isUlid('short')).toBe(false);
  });
});
