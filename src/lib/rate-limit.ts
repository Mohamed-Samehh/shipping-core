// Token-bucket and fixed-window rate limiters. Callers (rate APIs, label
// service, webhook dispatcher) wrap their hot loops in `consume(key, n)` and
// receive `true` (allowed) or `false` (rejected).

export interface RateLimiter {
  consume(key: string, count?: number): boolean;
  remaining(key: string): number;
}

export class TokenBucketLimiter implements RateLimiter {
  private readonly buckets = new Map<string, { tokens: number; updatedAt: number }>();

  constructor(
    private readonly capacity: number,
    private readonly refillPerSec: number,
    private readonly now: () => number = Date.now,
  ) {
    if (capacity <= 0 || refillPerSec <= 0) {
      throw new RangeError('capacity and refillPerSec must be positive');
    }
  }

  private refill(key: string): { tokens: number; updatedAt: number } {
    const t = this.now();
    const existing = this.buckets.get(key);
    if (!existing) {
      const fresh = { tokens: this.capacity, updatedAt: t };
      this.buckets.set(key, fresh);
      return fresh;
    }
    const elapsed = (t - existing.updatedAt) / 1000;
    existing.tokens = Math.min(this.capacity, existing.tokens + elapsed * this.refillPerSec);
    existing.updatedAt = t;
    return existing;
  }

  consume(key: string, count = 1): boolean {
    if (count <= 0) throw new RangeError('count must be positive');
    const bucket = this.refill(key);
    if (bucket.tokens >= count) {
      bucket.tokens -= count;
      return true;
    }
    return false;
  }

  remaining(key: string): number {
    return Math.floor(this.refill(key).tokens);
  }

  reset(key?: string): void {
    if (key === undefined) this.buckets.clear();
    else this.buckets.delete(key);
  }
}

export class FixedWindowLimiter implements RateLimiter {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {
    if (limit <= 0 || windowMs <= 0) throw new RangeError('limit and windowMs must be positive');
  }

  consume(key: string, count = 1): boolean {
    const t = this.now();
    let window = this.windows.get(key);
    if (!window || window.resetAt <= t) {
      window = { count: 0, resetAt: t + this.windowMs };
      this.windows.set(key, window);
    }
    if (window.count + count > this.limit) return false;
    window.count += count;
    return true;
  }

  remaining(key: string): number {
    const window = this.windows.get(key);
    if (!window) return this.limit;
    return Math.max(0, this.limit - window.count);
  }
}
