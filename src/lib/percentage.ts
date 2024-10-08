// Basis-point percentage helpers. 1 basis point = 0.01% = 1/10_000. Used by
// fuel-surcharge and zone-uplift calculations to avoid floating-point creep
// when chaining many small percentage adjustments.

import { Money, money } from './money';

export type BasisPoints = number; // integer, 0..1_000_000

export function bps(amount: number): BasisPoints {
  if (!Number.isInteger(amount)) throw new RangeError('basis points must be an integer');
  return amount;
}

export function fromPercent(percent: number): BasisPoints {
  return Math.round(percent * 100);
}

export function toPercent(b: BasisPoints): number {
  return b / 100;
}

export function applyBps(value: Money, b: BasisPoints): Money {
  return { amount: (value.amount * BigInt(b)) / 10_000n, currency: value.currency };
}

export function markup(value: Money, b: BasisPoints): Money {
  return { amount: value.amount + (value.amount * BigInt(b)) / 10_000n, currency: value.currency };
}

export function discount(value: Money, b: BasisPoints): Money {
  return { amount: value.amount - (value.amount * BigInt(b)) / 10_000n, currency: value.currency };
}

export function compound(steps: readonly BasisPoints[]): BasisPoints {
  if (steps.length === 0) return 0;
  let multiplier = 1;
  for (const b of steps) multiplier *= 1 + b / 10_000;
  return Math.round((multiplier - 1) * 10_000);
}

export function clampBps(b: BasisPoints, min = 0, max = 1_000_000): BasisPoints {
  return Math.min(max, Math.max(min, b));
}

export { money }; // re-export for callers writing fixture data
