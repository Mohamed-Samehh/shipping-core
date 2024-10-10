// UTC time helpers used throughout shipping-core for cut-off scheduling,
// transit-time math and end-of-day manifest close. All functions accept and
// return millisecond timestamps; ISO strings are only produced at boundaries.

export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = 60_000;
export const ONE_HOUR_MS = 3_600_000;
export const ONE_DAY_MS = 86_400_000;

export function startOfDayUtc(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function endOfDayUtc(ms: number): number {
  return startOfDayUtc(ms) + ONE_DAY_MS - 1;
}

export function addDaysUtc(ms: number, days: number): number {
  if (!Number.isInteger(days)) throw new RangeError('days must be an integer');
  return ms + days * ONE_DAY_MS;
}

export function addBusinessDaysUtc(ms: number, businessDays: number,
  holidaysIso: ReadonlySet<string> = new Set()): number {
  if (!Number.isInteger(businessDays)) throw new RangeError('businessDays must be an integer');
  const step = businessDays >= 0 ? 1 : -1;
  let remaining = Math.abs(businessDays);
  let cursor = startOfDayUtc(ms);
  while (remaining > 0) {
    cursor += step * ONE_DAY_MS;
    const d = new Date(cursor);
    const dayIso = d.toISOString().slice(0, 10);
    const day = d.getUTCDay();
    if (day === 0 || day === 6 || holidaysIso.has(dayIso)) continue;
    remaining -= 1;
  }
  return cursor;
}

export function isWeekendUtc(ms: number): boolean {
  const day = new Date(ms).getUTCDay();
  return day === 0 || day === 6;
}

export function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function fromIsoDate(iso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new RangeError('expected YYYY-MM-DD');
  return Date.parse(iso + 'T00:00:00Z');
}

export function diffDaysUtc(a: number, b: number): number {
  return Math.floor((startOfDayUtc(a) - startOfDayUtc(b)) / ONE_DAY_MS);
}
