// Day / week / month recurrence helpers used by pickup schedules and the
// repeat-shipping plans for subscription customers.

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrenceSpec {
  readonly frequency: Frequency;
  readonly interval: number;
  readonly startMs: number;
  readonly endMs?: number;
  readonly count?: number;
}

const DAY_MS = 86_400_000;

export function* expandOccurrences(spec: RecurrenceSpec): Generator<number> {
  if (spec.interval < 1 || !Number.isInteger(spec.interval)) {
    throw new RangeError('interval must be a positive integer');
  }
  let cursor = spec.startMs;
  let emitted = 0;
  while (true) {
    if (spec.endMs !== undefined && cursor > spec.endMs) return;
    if (spec.count !== undefined && emitted >= spec.count) return;
    yield cursor;
    emitted += 1;
    switch (spec.frequency) {
      case 'daily':
        cursor += spec.interval * DAY_MS;
        break;
      case 'weekly':
        cursor += spec.interval * 7 * DAY_MS;
        break;
      case 'monthly': {
        const d = new Date(cursor);
        d.setUTCMonth(d.getUTCMonth() + spec.interval);
        cursor = d.getTime();
        break;
      }
    }
  }
}

export function nextAfter(spec: RecurrenceSpec, fromMs: number): number | undefined {
  for (const ts of expandOccurrences(spec)) {
    if (ts > fromMs) return ts;
  }
  return undefined;
}

export function countOccurrences(spec: RecurrenceSpec, endMs: number): number {
  let count = 0;
  for (const ts of expandOccurrences({ ...spec, endMs })) { count += 1; void ts; }
  return count;
}
