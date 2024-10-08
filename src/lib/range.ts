// Numeric and integer range helpers used for capacity / weight bucket math.

export interface IntRange {
  readonly start: number;
  readonly end: number; // exclusive
}

export function range(start: number, end: number): IntRange {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new RangeError('range bounds must be integers');
  }
  if (end < start) throw new RangeError('end must be >= start');
  return { start, end };
}

export function contains(r: IntRange, value: number): boolean {
  return Number.isInteger(value) && value >= r.start && value < r.end;
}

export function overlaps(a: IntRange, b: IntRange): boolean {
  return a.start < b.end && b.start < a.end;
}

export function intersection(a: IntRange, b: IntRange): IntRange | undefined {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  if (start >= end) return undefined;
  return { start, end };
}

export function* iterate(r: IntRange): IterableIterator<number> {
  for (let i = r.start; i < r.end; i++) yield i;
}

export function size(r: IntRange): number {
  return Math.max(0, r.end - r.start);
}

export function clamp(value: number, r: IntRange): number {
  return Math.min(r.end - 1, Math.max(r.start, value));
}
