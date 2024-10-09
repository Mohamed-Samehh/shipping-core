// Co-operative concurrency primitives. parallelLimit lets bulk callers cap
// concurrent dispatch to a carrier API; Mutex / Semaphore are used by the
// in-memory repositories to keep multi-step writes consistent.

export class Semaphore {
  private permits: number;
  private waiters: Array<() => void> = [];

  constructor(permits: number) {
    if (permits < 1 || !Number.isInteger(permits)) {
      throw new RangeError('permits must be a positive integer');
    }
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits -= 1;
      return;
    }
    await new Promise<void>((resolve) => this.waiters.push(resolve));
  }

  release(): void {
    const next = this.waiters.shift();
    if (next) next();
    else this.permits += 1;
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try { return await fn(); }
    finally { this.release(); }
  }
}

export class Mutex {
  private readonly sem = new Semaphore(1);
  acquire(): Promise<void> { return this.sem.acquire(); }
  release(): void { this.sem.release(); }
  run<T>(fn: () => Promise<T>): Promise<T> { return this.sem.run(fn); }
}

export class KeyedMutex {
  private readonly locks = new Map<string, Mutex>();
  async run<T>(key: string, fn: () => Promise<T>): Promise<T> {
    let mu = this.locks.get(key);
    if (!mu) { mu = new Mutex(); this.locks.set(key, mu); }
    return mu.run(fn);
  }
}

export async function parallelLimit<T, R>(items: readonly T[], limit: number,
  fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  if (limit < 1 || !Number.isInteger(limit)) throw new RangeError('limit must be positive int');
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    workers.push((async () => {
      while (true) {
        const idx = cursor++;
        if (idx >= items.length) return;
        results[idx] = await fn(items[idx] as T, idx);
      }
    })());
  }
  await Promise.all(workers);
  return results;
}
