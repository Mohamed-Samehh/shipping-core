// Exponential-backoff retry helper. Service code wraps gateway calls so
// transient carrier failures get a bounded retry without callers having to
// thread a retry loop manually.

export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  factor: number;
  isTransient?: (error: unknown) => boolean;
  sleep?: (ms: number) => Promise<void>;
}

export function isTransient(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; status?: number };
  if (e.code && /^(ETIMEDOUT|ECONNRESET|EAI_AGAIN|ECONNREFUSED|EHOSTUNREACH|EPIPE)$/.test(e.code)) {
    return true;
  }
  if (e.status && e.status >= 500 && e.status < 600) return true;
  if (e.status === 408 || e.status === 429) return true;
  return false;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  if (options.maxAttempts < 1) throw new RangeError('maxAttempts must be >= 1');
  if (options.factor < 1) throw new RangeError('factor must be >= 1');
  const sleep = options.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const detect = options.isTransient ?? isTransient;
  let attempt = 0;
  let delay = options.initialDelayMs;
  while (true) {
    attempt += 1;
    try {
      return await fn();
    } catch (error) {
      if (attempt >= options.maxAttempts || !detect(error)) throw error;
      await sleep(Math.min(delay, options.maxDelayMs));
      delay = Math.min(delay * options.factor, options.maxDelayMs);
    }
  }
}
