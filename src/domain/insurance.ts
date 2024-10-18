// Declared-value insurance coverage purchased on a per-shipment basis.

import { z } from '../lib/validate';

export const InsuranceProvider = z.enum(['carrier', 'third_party', 'self']);
export type InsuranceProviderValue = z.infer<typeof InsuranceProvider>;

export const InsuranceSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  provider: InsuranceProvider,
  coverageAmount: z.bigint(),
  coverageCurrency: z.string().length(3),
  premiumAmount: z.bigint(),
  premiumCurrency: z.string().length(3),
  policyNumber: z.string().max(80).optional(),
  effectiveAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
});

export type Insurance = z.infer<typeof InsuranceSchema>;

export function parseInsurance(value: unknown): Insurance {
  return InsuranceSchema.parse(value);
}

export function isInsuranceActive(insurance: Insurance, nowMs: number): boolean {
  return insurance.effectiveAt <= nowMs && insurance.expiresAt > nowMs;
}
