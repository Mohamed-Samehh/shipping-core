// Customer contract pinning negotiated discounts and surcharge waivers for a
// fixed period. Each contract belongs to one customer and references zero or
// more carriers.

import { z } from '../lib/validate';

export const ContractStatus = z.enum(['draft', 'active', 'expired', 'cancelled']);
export type ContractStatusValue = z.infer<typeof ContractStatus>;

export const ContractSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  name: z.string().min(1).max(120),
  status: ContractStatus.default('draft'),
  effectiveAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative(),
  monthlyVolumeFloor: z.number().int().nonnegative().optional(),
  carrierIds: z.array(z.string()).default([]),
  discountIds: z.array(z.string()).default([]),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Contract = z.infer<typeof ContractSchema>;

export function parseContract(value: unknown): Contract {
  return ContractSchema.parse(value);
}

export function isContractActive(contract: Contract, nowMs: number): boolean {
  return contract.status === 'active'
    && contract.effectiveAt <= nowMs
    && contract.expiresAt > nowMs;
}
