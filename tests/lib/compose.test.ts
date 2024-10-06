import { pipe, compose, identity, constant, tap, memoize } from '../../src/lib/compose';

describe('compose helpers', () => {
  test('pipe threads value through fns', () => {
    expect(pipe(2, (n) => n + 1, (n) => n * 3)).toBe(9);
  });

  test('compose builds a function', () => {
    const f = compose((n: number) => n + 1, (n) => n * 3);
    expect(f(2)).toBe(9);
  });

  test('identity returns input', () => {
    expect(identity(7)).toBe(7);
  });

  test('constant returns fixed value', () => {
    expect(constant(5)()).toBe(5);
  });

  test('tap runs side effect', () => {
    const captured: number[] = [];
    expect(tap<number>((v) => captured.push(v))(7)).toBe(7);
    expect(captured).toEqual([7]);
  });

  test('memoize caches by argument hash', () => {
    let calls = 0;
    const fn = memoize((n: number) => { calls += 1; return n * 2; });
    fn(2); fn(2); fn(3);
    expect(calls).toBe(2);
  });
});
