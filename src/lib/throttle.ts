// Simple throttle that drops calls until the configured interval elapses.
// Used by tracking-poll fan-out to keep carrier API quotas safe.

export interface Throttle<Args extends readonly unknown[], R> {
  (...args: Args): R | undefined;
  reset(): void;
}

export function throttle<Args extends readonly unknown[], R>(
  fn: (...args: Args) => R,
  intervalMs: number,
  now: () => number = Date.now,
): Throttle<Args, R> {
  if (intervalMs <= 0) throw new RangeError('intervalMs must be positive');
  let last = -Infinity;
  const wrapped = ((...args: Args): R | undefined => {
    const t = now();
    if (t - last < intervalMs) return undefined;
    last = t;
    return fn(...args);
  }) as Throttle<Args, R>;
  wrapped.reset = () => { last = -Infinity; };
  return wrapped;
}

export function debounce<Args extends readonly unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): { (...args: Args): void; cancel(): void } {
  if (delayMs <= 0) throw new RangeError('delayMs must be positive');
  let timer: NodeJS.Timeout | undefined;
  const wrapped = ((...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { fn(...args); }, delayMs);
  }) as { (...args: Args): void; cancel(): void };
  wrapped.cancel = () => {
    if (timer) { clearTimeout(timer); timer = undefined; }
  };
  return wrapped;
}
