// Closed-form exponential backoff. Used as the delay calculator inside the
// retry helper and by the webhook scheduler when picking the next attempt time.

export type JitterMode = 'none' | 'full' | 'equal' | 'decorrelated';

export interface BackoffOptions {
  readonly initialDelayMs: number;
  readonly factor: number;
  readonly maxDelayMs: number;
  readonly jitter?: JitterMode;
  readonly random?: () => number;
}

export function expBackoff(attempt: number, options: BackoffOptions, previousDelay = 0): number {
  if (attempt < 1) throw new RangeError('attempt must be >= 1');
  if (options.factor < 1) throw new RangeError('factor must be >= 1');
  const base = Math.min(
    options.maxDelayMs,
    options.initialDelayMs * options.factor ** (attempt - 1),
  );
  const rng = options.random ?? Math.random;
  switch (options.jitter ?? 'none') {
    case 'none': return base;
    case 'full': return rng() * base;
    case 'equal': return base / 2 + rng() * (base / 2);
    case 'decorrelated': {
      const cap = Math.min(options.maxDelayMs,
        Math.max(options.initialDelayMs, previousDelay * 3));
      return options.initialDelayMs + rng() * (cap - options.initialDelayMs);
    }
  }
}
