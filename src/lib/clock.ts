// Clock abstraction so business logic depending on "the current time" can be
// tested deterministically. Production code wires a `SystemClock`; tests
// instantiate `FixedClock` and step it forward explicitly.

export interface Clock {
  now(): number;
  iso(): string;
}

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
  iso(): string {
    return new Date(this.now()).toISOString();
  }
}

export class FixedClock implements Clock {
  private value: number;

  constructor(initial: number | string | Date) {
    this.value = toMillis(initial);
  }

  now(): number {
    return this.value;
  }

  iso(): string {
    return new Date(this.value).toISOString();
  }

  advance(ms: number): void {
    if (!Number.isFinite(ms)) throw new RangeError('advance ms must be finite');
    this.value += ms;
  }

  set(value: number | string | Date): void {
    this.value = toMillis(value);
  }
}

function toMillis(value: number | string | Date): number {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new RangeError('clock millis must be finite');
    return value;
  }
  if (value instanceof Date) return value.getTime();
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) throw new TypeError(`invalid timestamp: ${value}`);
  return parsed;
}
