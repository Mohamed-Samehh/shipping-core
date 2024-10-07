// Async-iterable utilities used by the manifest / tracking services to fan
// through carrier batch responses without pulling everything in memory.

export async function take<T>(source: AsyncIterable<T>, n: number): Promise<T[]> {
  const out: T[] = [];
  for await (const item of source) {
    out.push(item);
    if (out.length === n) break;
  }
  return out;
}

export async function toArray<T>(source: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of source) out.push(item);
  return out;
}

export async function* mapAsync<T, R>(source: AsyncIterable<T>,
  fn: (item: T) => R | Promise<R>): AsyncIterable<R> {
  for await (const item of source) yield await fn(item);
}

export async function* filterAsync<T>(source: AsyncIterable<T>,
  predicate: (item: T) => boolean | Promise<boolean>): AsyncIterable<T> {
  for await (const item of source) {
    if (await predicate(item)) yield item;
  }
}

export async function* chunkAsync<T>(source: AsyncIterable<T>, size: number): AsyncIterable<T[]> {
  if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be positive int');
  let buffer: T[] = [];
  for await (const item of source) {
    buffer.push(item);
    if (buffer.length >= size) { yield buffer; buffer = []; }
  }
  if (buffer.length > 0) yield buffer;
}

export async function reduceAsync<T, R>(source: AsyncIterable<T>,
  initial: R, fn: (acc: R, item: T) => R | Promise<R>): Promise<R> {
  let acc = initial;
  for await (const item of source) acc = await fn(acc, item);
  return acc;
}

export async function* fromArray<T>(items: readonly T[]): AsyncIterable<T> {
  for (const item of items) yield item;
}
