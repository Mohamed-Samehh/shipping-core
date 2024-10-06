// Simple 5-field cron parser: minute hour dom month dow. Sufficient for the
// daily/weekly tasks the dispatcher schedules. No L / W / # extensions.

export interface CronSchedule {
  readonly minute: ReadonlySet<number>;
  readonly hour: ReadonlySet<number>;
  readonly dom: ReadonlySet<number>;
  readonly month: ReadonlySet<number>;
  readonly dow: ReadonlySet<number>;
}

export function parseCron(expression: string): CronSchedule {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) throw new RangeError('cron expression must have 5 fields');
  return {
    minute: parseField(parts[0] as string, 0, 59),
    hour: parseField(parts[1] as string, 0, 23),
    dom: parseField(parts[2] as string, 1, 31),
    month: parseField(parts[3] as string, 1, 12),
    dow: parseField(parts[4] as string, 0, 6),
  };
}

function parseField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of field.split(',')) {
    let step = 1;
    let body = part;
    if (body.includes('/')) {
      const [b, s] = body.split('/');
      body = b as string;
      step = Number(s);
      if (!Number.isInteger(step) || step <= 0) throw new RangeError(`bad cron step: ${part}`);
    }
    let start = min;
    let end = max;
    if (body === '*') {
      // already min..max
    } else if (body.includes('-')) {
      const [lo, hi] = body.split('-');
      start = Number(lo);
      end = Number(hi);
    } else {
      start = Number(body);
      end = start;
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < min || end > max || end < start) {
      throw new RangeError(`bad cron value: ${part}`);
    }
    for (let i = start; i <= end; i += step) out.add(i);
  }
  return out;
}

export function matches(schedule: CronSchedule, ms: number): boolean {
  const d = new Date(ms);
  return schedule.minute.has(d.getUTCMinutes())
    && schedule.hour.has(d.getUTCHours())
    && schedule.dom.has(d.getUTCDate())
    && schedule.month.has(d.getUTCMonth() + 1)
    && schedule.dow.has(d.getUTCDay());
}

export function nextAfter(schedule: CronSchedule, ms: number, maxIterations = 525_600): number {
  let cursor = Math.floor(ms / 60_000) * 60_000 + 60_000;
  for (let i = 0; i < maxIterations; i++) {
    if (matches(schedule, cursor)) return cursor;
    cursor += 60_000;
  }
  throw new Error('cron next-after: no match within window');
}
