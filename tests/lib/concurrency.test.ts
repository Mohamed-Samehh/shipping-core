import { Semaphore, Mutex, KeyedMutex, parallelLimit } from '../../src/lib/concurrency';

describe('Semaphore', () => {
  test('caps concurrent work', async () => {
    const sem = new Semaphore(2);
    let active = 0;
    let max = 0;
    await Promise.all([1, 2, 3, 4, 5].map(() =>
      sem.run(async () => {
        active += 1;
        max = Math.max(max, active);
        await new Promise((r) => setTimeout(r, 1));
        active -= 1;
      })
    ));
    expect(max).toBeLessThanOrEqual(2);
  });

  test('rejects invalid permits', () => {
    expect(() => new Semaphore(0)).toThrow();
  });
});

describe('Mutex', () => {
  test('serialises work', async () => {
    const mu = new Mutex();
    const order: number[] = [];
    await Promise.all([1, 2, 3].map((n) => mu.run(async () => {
      order.push(n * 10);
      await new Promise((r) => setTimeout(r, 1));
      order.push(n * 10 + 1);
    })));
    expect(order).toEqual([10, 11, 20, 21, 30, 31]);
  });
});

describe('KeyedMutex', () => {
  test('different keys do not block each other', async () => {
    const km = new KeyedMutex();
    const t0 = Date.now();
    await Promise.all(['a', 'b'].map((k) => km.run(k, async () => {
      await new Promise((r) => setTimeout(r, 20));
    })));
    expect(Date.now() - t0).toBeLessThan(60);
  });
});

describe('parallelLimit', () => {
  test('processes all items', async () => {
    const out = await parallelLimit([1, 2, 3, 4], 2, async (n) => n * 2);
    expect(out).toEqual([2, 4, 6, 8]);
  });

  test('rejects zero limit', async () => {
    await expect(parallelLimit([1], 0, async () => 1)).rejects.toThrow();
  });
});
