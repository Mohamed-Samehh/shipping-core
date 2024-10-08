import { defer, delay, withTimeout } from '../../src/lib/deferred';

describe('Deferred', () => {
  test('resolve fulfils the promise', async () => {
    const d = defer<number>();
    queueMicrotask(() => d.resolve(7));
    expect(await d.promise).toBe(7);
  });

  test('reject rejects the promise', async () => {
    const d = defer<number>();
    queueMicrotask(() => d.reject(new Error('x')));
    await expect(d.promise).rejects.toThrow('x');
  });
});

describe('delay', () => {
  test('resolves after timeout', async () => {
    const t0 = Date.now();
    await delay(5);
    expect(Date.now() - t0).toBeGreaterThanOrEqual(4);
  });
});

describe('withTimeout', () => {
  test('rejects when promise takes too long', async () => {
    await expect(withTimeout(new Promise(() => {}), 10)).rejects.toThrow('timeout');
  });

  test('resolves when promise wins', async () => {
    await expect(withTimeout(Promise.resolve('hi'), 100)).resolves.toBe('hi');
  });
});
