// Estimate delivery dates from a transit-day range, the dispatch timestamp
// and an optional country-specific holiday set.

import { addBusinessDaysUtc } from './time';

export interface TransitEstimate {
  readonly earliest: number;
  readonly latest: number;
  readonly businessDays: number;
}

export interface TransitOptions {
  readonly transitDaysMin: number;
  readonly transitDaysMax: number;
  readonly weekendDelivery?: boolean;
  readonly holidays?: ReadonlySet<string>;
}

export function estimateTransit(dispatchMs: number, options: TransitOptions): TransitEstimate {
  if (options.transitDaysMin < 0 || options.transitDaysMax < options.transitDaysMin) {
    throw new RangeError('invalid transit-day bounds');
  }
  const holidays = options.holidays ?? new Set<string>();
  if (options.weekendDelivery) {
    const dayMs = 86_400_000;
    return {
      earliest: dispatchMs + options.transitDaysMin * dayMs,
      latest: dispatchMs + options.transitDaysMax * dayMs,
      businessDays: options.transitDaysMax,
    };
  }
  const earliest = addBusinessDaysUtc(dispatchMs, options.transitDaysMin, holidays);
  const latest = addBusinessDaysUtc(dispatchMs, options.transitDaysMax, holidays);
  return { earliest, latest, businessDays: options.transitDaysMax };
}

export function isOnTime(deliveredAtMs: number, estimate: TransitEstimate): boolean {
  return deliveredAtMs <= estimate.latest;
}

export function delayDays(deliveredAtMs: number, estimate: TransitEstimate): number {
  if (deliveredAtMs <= estimate.latest) return 0;
  return Math.ceil((deliveredAtMs - estimate.latest) / 86_400_000);
}
