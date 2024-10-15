// Carrier or in-house surcharge applied to a rate (fuel, residential, peak,
// remote-area). Surcharges may be flat or percentage; the rate engine sums
// them in the right order.

import { z } from '../lib/validate';

export const SurchargeKind = z.enum([
  'fuel', 'residential', 'remote', 'peak', 'oversize', 'overweight',
  'signature', 'saturday', 'cod', 'hazmat', 'declared_value',
]);
export type SurchargeKindValue = z.infer<typeof SurchargeKind>;

export const SurchargeSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  serviceId: z.string().min(1).optional(),
  kind: SurchargeKind,
  code: z.string().min(2).max(32),
  name: z.string().min(1).max(120),
  flatAmount: z.bigint().optional(),
  flatCurrency: z.string().length(3).optional(),
  basisPoints: z.number().int().nonnegative().optional(),
  effectiveAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative().optional(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Surcharge = z.infer<typeof SurchargeSchema>;

export function parseSurcharge(value: unknown): Surcharge {
  return SurchargeSchema.parse(value);
}

export function isSurchargeActive(surcharge: Surcharge, nowMs: number): boolean {
  if (!surcharge.enabled) return false;
  if (surcharge.effectiveAt > nowMs) return false;
  if (surcharge.expiresAt !== undefined && surcharge.expiresAt <= nowMs) return false;
  return true;
}

export function isPercentageSurcharge(surcharge: Surcharge): boolean {
  return typeof surcharge.basisPoints === 'number';
}
