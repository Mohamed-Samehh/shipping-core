// Seedable pseudo-random source. Tests pin the seed and treat outputs as
// deterministic; production callers wire `Math.random` via `SystemRandom`.

export interface Random {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
  shuffle<T>(values: readonly T[]): T[];
}

export class Mulberry32 implements Random {
  private state: number;

  constructor(seed: number) {
    if (!Number.isFinite(seed)) throw new RangeError('seed must be finite');
    this.state = (Math.trunc(seed) >>> 0) || 1;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new TypeError('int bounds must be integers');
    }
    if (max < min) throw new RangeError('max must be >= min');
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new RangeError('pick: empty array');
    return values[this.int(0, values.length - 1)] as T;
  }

  shuffle<T>(values: readonly T[]): T[] {
    const out = values.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j] as T, out[i] as T];
    }
    return out;
  }
}

export class SystemRandom implements Random {
  next(): number {
    return Math.random();
  }
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new RangeError('pick: empty array');
    return values[this.int(0, values.length - 1)] as T;
  }
  shuffle<T>(values: readonly T[]): T[] {
    const out = values.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j] as T, out[i] as T];
    }
    return out;
  }
}
