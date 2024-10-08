// Deterministic id generators used across the shipping domain. Production
// callers wire `CounterIdGenerator`; tests pin specific prefixes so fixture
// data has stable ids across runs.

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

export interface IdGenerator {
  next(prefix?: string): string;
}

export class CounterIdGenerator implements IdGenerator {
  private counter = 0;
  constructor(private readonly defaultPrefix = 'id') {}

  next(prefix?: string): string {
    this.counter += 1;
    const p = (prefix ?? this.defaultPrefix).trim();
    if (p.length === 0) throw new TypeError('id prefix must be non-empty');
    return `${p}_${this.counter.toString().padStart(8, '0')}`;
  }

  reset(): void {
    this.counter = 0;
  }

  peek(prefix?: string): string {
    const p = (prefix ?? this.defaultPrefix).trim();
    if (p.length === 0) throw new TypeError('id prefix must be non-empty');
    const next = this.counter + 1;
    return `${p}_${next.toString().padStart(8, '0')}`;
  }
}

export function shortId(seed: number, length = 8): string {
  if (length < 1 || length > 32) throw new RangeError('length must be 1..32');
  let n = Math.abs(Math.trunc(seed));
  let out = '';
  while (out.length < length) {
    out = ALPHABET[n % ALPHABET.length] + out;
    n = Math.floor(n / ALPHABET.length);
    if (n === 0 && out.length < length) {
      out = ALPHABET[0]!.repeat(length - out.length) + out;
      break;
    }
  }
  return out;
}

export function isShortId(value: string): boolean {
  if (!value) return false;
  return value.split('').every((ch) => ALPHABET.includes(ch));
}

export function prefixedId(prefix: string, counter: number): string {
  if (!/^[a-z][a-z0-9_]*$/.test(prefix)) {
    throw new TypeError(`invalid id prefix: ${prefix}`);
  }
  if (!Number.isInteger(counter) || counter < 0) {
    throw new RangeError('counter must be a non-negative integer');
  }
  return `${prefix}_${counter.toString().padStart(8, '0')}`;
}
