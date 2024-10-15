// Day-based proration. Used by short-lived contract billing and one-off
// addons that cover a partial period.

import { Money } from './money';
import { allocate } from './money';

export function daysBetween(startMs: number, endMs: number): number {
  if (endMs <= startMs) return 0;
  const MS_PER_DAY = 86_400_000;
  return Math.ceil((endMs - startMs) / MS_PER_DAY);
}

export function prorate(amount: Money, days: number, totalDays: number): Money {
  if (totalDays <= 0) throw new RangeError('totalDays must be > 0');
  if (days < 0) throw new RangeError('days must be >= 0');
  if (days >= totalDays) return amount;
  const parts = allocate(amount, totalDays);
  let total = 0n;
  for (let i = 0; i < days; i++) total += (parts[i] as Money).amount;
  return { amount: total, currency: amount.currency };
}

export function prorateBetween(amount: Money, startMs: number, endMs: number,
  fullPeriodMs: number): Money {
  if (fullPeriodMs <= 0) throw new RangeError('fullPeriodMs must be > 0');
  const overlap = Math.max(0, endMs - startMs);
  if (overlap >= fullPeriodMs) return amount;
  const factor = overlap / fullPeriodMs;
  return { amount: BigInt(Math.round(Number(amount.amount) * factor)), currency: amount.currency };
}
