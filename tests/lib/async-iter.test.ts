import { take, toArray, mapAsync, filterAsync, chunkAsync, reduceAsync, fromArray } from '../../src/lib/async-iter';

describe('async-iter', () => {
  test('toArray drains an iterable', async () => {
    expect(await toArray(fromArray([1, 2, 3]))).toEqual([1, 2, 3]);
  });

  test('take limits to N', async () => {
    expect(await take(fromArray([1, 2, 3, 4, 5]), 3)).toEqual([1, 2, 3]);
  });

  test('mapAsync transforms', async () => {
    expect(await toArray(mapAsync(fromArray([1, 2]), (n) => n * 2))).toEqual([2, 4]);
  });

  test('filterAsync drops false predicates', async () => {
    expect(await toArray(filterAsync(fromArray([1, 2, 3, 4]), (n) => n % 2 === 0))).toEqual([2, 4]);
  });

  test('chunkAsync batches by size', async () => {
    expect(await toArray(chunkAsync(fromArray([1, 2, 3, 4, 5]), 2))).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('reduceAsync accumulates', async () => {
    expect(await reduceAsync(fromArray([1, 2, 3]), 0, (acc, n) => acc + n)).toBe(6);
  });
});
