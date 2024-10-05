import { ok, err, isOk, isErr, mapResult, mapError, andThen, unwrap, unwrapOr, unwrapOrElse, tryAsync, trySync, collect } from '../../src/lib/result';

describe('Result', () => {
  test('ok / err / isOk / isErr', () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(err('x'))).toBe(true);
    expect(isOk(err('x'))).toBe(false);
    expect(isErr(ok(1))).toBe(false);
  });

  test('mapResult only runs on Ok', () => {
    expect(mapResult(ok(2), (n) => n * 3)).toEqual(ok(6));
    expect(mapResult(err('e'), (n: number) => n * 3)).toEqual(err('e'));
  });

  test('mapError only runs on Err', () => {
    expect(mapError(err('e'), (s) => s.toUpperCase())).toEqual(err('E'));
    expect(mapError(ok(2), (s: string) => s)).toEqual(ok(2));
  });

  test('andThen chains', () => {
    const r = andThen(ok(2), (n) => ok(n + 1));
    expect(r).toEqual(ok(3));
    const r2 = andThen(err<string>('e'), (n: number) => ok(n));
    expect(r2).toEqual(err('e'));
  });

  test('unwrap returns value or throws', () => {
    expect(unwrap(ok('hi'))).toBe('hi');
    expect(() => unwrap(err(new Error('bad')))).toThrow('bad');
  });

  test('unwrapOr returns fallback on Err', () => {
    expect(unwrapOr(ok(2), 99)).toBe(2);
    expect(unwrapOr(err('e'), 99)).toBe(99);
  });

  test('unwrapOrElse calls handler on Err', () => {
    expect(unwrapOrElse(err('e'), (e) => e.length)).toBe(1);
  });

  test('tryAsync wraps a thrown promise', async () => {
    const good = await tryAsync(async () => 7);
    expect(good).toEqual(ok(7));
    const bad = await tryAsync(async () => {
      throw new Error('nope');
    });
    expect(isErr(bad)).toBe(true);
  });

  test('trySync wraps a thrown sync fn', () => {
    expect(trySync(() => 7)).toEqual(ok(7));
    const r = trySync(() => {
      throw new Error('nope');
    });
    expect(isErr(r)).toBe(true);
  });

  test('collect returns first Err or array of values', () => {
    expect(collect([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
    expect(collect([ok(1), err<string>('e'), ok(3)])).toEqual(err('e'));
  });
});
