// Shipper-side discount that subtracts from a rate. Often a contract-level
// percentage, sometimes a flat per-shipment amount.

import { z } from '../lib/validate';

export const DiscountKind = z.enum(['flat', 'percentage', 'tiered_weight']);
export type DiscountKindValue = z.infer<typeof DiscountKind>;

export const DiscountSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  carrierId: z.string().min(1).optional(),
  serviceId: z.string().min(1).optional(),
  kind: DiscountKind,
  code: z.string().min(2).max(32),
  flatAmount: z.bigint().optional(),
  flatCurrency: z.string().length(3).optional(),
  basisPoints: z.number().int().nonnegative().optional(),
  tiers: z.array(z.object({
    minWeightG: z.number().nonnegative(),
    basisPoints: z.number().int().nonnegative(),
  })).default([]),
  effectiveAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative().optional(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Discount = z.infer<typeof DiscountSchema>;

export function parseDiscount(value: unknown): Discount {
  return DiscountSchema.parse(value);
}

export function isDiscountActive(discount: Discount, nowMs: number): boolean {
  if (!discount.enabled) return false;
  if (discount.effectiveAt > nowMs) return false;
  if (discount.expiresAt !== undefined && discount.expiresAt <= nowMs) return false;
  return true;
}
