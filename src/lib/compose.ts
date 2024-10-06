// Pipe / compose helpers. Used in service unit tests where we want to chain
// a few pure helpers without a lambda jungle.

export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(value: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(value: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
export function pipe(value: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

export function compose<A>(): (a: A) => A;
export function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function compose<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function compose(...fns: Array<(x: unknown) => unknown>): (value: unknown) => unknown {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

export function identity<T>(value: T): T { return value; }

export function constant<T>(value: T): () => T { return () => value; }

export function tap<T>(side: (value: T) => void): (value: T) => T {
  return (value) => { side(value); return value; };
}

export function memoize<Args extends readonly unknown[], R>(
  fn: (...args: Args) => R,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args),
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = keyFn(...args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key) as R;
  };
}
