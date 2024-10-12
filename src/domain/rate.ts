// Cached rate quote for a particular (shipment, carrier, service) tuple.
// Most callers will compare across the rate set rather than booking the
// cheapest blindly.

import { z } from '../lib/validate';

export const RateSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  carrierId: z.string().min(1),
  serviceId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  amount: z.bigint(),
  currency: z.string().length(3),
  baseAmount: z.bigint(),
  surchargesAmount: z.bigint().default(0n),
  discountAmount: z.bigint().default(0n),
  taxAmount: z.bigint().default(0n),
  estimatedTransitDays: z.number().int().nonnegative(),
  guaranteedBy: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  expiresAt: z.number().int().nonnegative(),
  zone: z.number().int().positive().optional(),
  billableWeightG: z.number().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
});

export type Rate = z.infer<typeof RateSchema>;

export function parseRate(value: unknown): Rate {
  return RateSchema.parse(value);
}

export function isRateExpired(rate: Rate, nowMs: number): boolean {
  return rate.expiresAt <= nowMs;
}

export function rateSubtotal(rate: Rate): bigint {
  return rate.baseAmount + rate.surchargesAmount - rate.discountAmount + rate.taxAmount;
}
