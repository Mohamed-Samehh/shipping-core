// Human-readable duration parser / formatter. Used for transit-time fields on
// rates and service-level commitments.

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

const UNITS: Record<string, number> = {
  ms: 1, s: SECOND_MS, sec: SECOND_MS, secs: SECOND_MS, second: SECOND_MS, seconds: SECOND_MS,
  m: MINUTE_MS, min: MINUTE_MS, mins: MINUTE_MS, minute: MINUTE_MS, minutes: MINUTE_MS,
  h: HOUR_MS, hr: HOUR_MS, hrs: HOUR_MS, hour: HOUR_MS, hours: HOUR_MS,
  d: DAY_MS, day: DAY_MS, days: DAY_MS,
};

export function parseDuration(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) throw new RangeError('empty duration');
  let total = 0;
  const re = /(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g;
  let match: RegExpExecArray | null;
  let matched = false;
  while ((match = re.exec(trimmed)) !== null) {
    matched = true;
    const amount = Number(match[1]);
    const unit = (match[2] as string).toLowerCase();
    const factor = UNITS[unit];
    if (factor === undefined) throw new RangeError(`unknown duration unit: ${unit}`);
    total += amount * factor;
  }
  if (!matched) throw new RangeError(`unrecognised duration: ${value}`);
  return total;
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) throw new RangeError('duration ms must be finite');
  const sign = ms < 0 ? '-' : '';
  let remaining = Math.abs(ms);
  const parts: string[] = [];
  const slots: Array<[string, number]> = [['d', DAY_MS], ['h', HOUR_MS], ['m', MINUTE_MS], ['s', SECOND_MS]];
  for (const [unit, factor] of slots) {
    const count = Math.floor(remaining / factor);
    if (count > 0) { parts.push(`${count}${unit}`); remaining -= count * factor; }
  }
  if (parts.length === 0) parts.push('0s');
  return sign + parts.join(' ');
}
