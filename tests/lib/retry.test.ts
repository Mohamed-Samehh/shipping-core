import { isTransient, withRetry } from '../../src/lib/retry';

describe('isTransient', () => {
  test('detects common network error codes', () => {
    expect(isTransient({ code: 'ETIMEDOUT' })).toBe(true);
    expect(isTransient({ code: 'ECONNREFUSED' })).toBe(true);
    expect(isTransient({ code: 'EUSER' })).toBe(false);
  });

  test('detects retryable status codes', () => {
    expect(isTransient({ status: 503 })).toBe(true);
    expect(isTransient({ status: 429 })).toBe(true);
    expect(isTransient({ status: 400 })).toBe(false);
  });

  test('non-errors are not transient', () => {
    expect(isTransient(undefined)).toBe(false);
    expect(isTransient('nope')).toBe(false);
  });
});

describe('withRetry', () => {
  test('retries transient failures and eventually succeeds', async () => {
    let calls = 0;
    const r = await withRetry(async () => {
      calls += 1;
      if (calls < 3) throw { code: 'ETIMEDOUT' };
      return 'ok';
    }, { maxAttempts: 5, initialDelayMs: 0, maxDelayMs: 0, factor: 2, sleep: async () => {} });
    expect(r).toBe('ok');
    expect(calls).toBe(3);
  });

  test('does not retry non-transient errors', async () => {
    let calls = 0;
    await expect(withRetry(async () => {
      calls += 1;
      throw new Error('permanent');
    }, { maxAttempts: 5, initialDelayMs: 0, maxDelayMs: 0, factor: 2, sleep: async () => {} }))
      .rejects.toThrow('permanent');
    expect(calls).toBe(1);
  });

  test('gives up after maxAttempts', async () => {
    let calls = 0;
    await expect(withRetry(async () => {
      calls += 1;
      throw { code: 'ETIMEDOUT' };
    }, { maxAttempts: 3, initialDelayMs: 0, maxDelayMs: 0, factor: 2, sleep: async () => {} }))
      .rejects.toBeTruthy();
    expect(calls).toBe(3);
  });

  test('rejects invalid options', async () => {
    await expect(withRetry(async () => 1, {
      maxAttempts: 0, initialDelayMs: 0, maxDelayMs: 0, factor: 2,
    })).rejects.toThrow();
  });
});
