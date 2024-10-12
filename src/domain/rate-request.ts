// Persisted rate-shopping request. Lets the dispatch UI rehydrate a
// previously fetched rate set without re-calling the carriers.

import { z } from '../lib/validate';

export const RateRequestSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  shipmentId: z.string().min(1).optional(),
  fromAddressId: z.string().min(1),
  toAddressId: z.string().min(1),
  packageHashes: z.array(z.string().min(8)).min(1),
  carrierIdFilter: z.array(z.string()).default([]),
  serviceCategoryFilter: z.array(z.string()).default([]),
  saturdayDelivery: z.boolean().default(false),
  isResidential: z.boolean().default(false),
  rateIds: z.array(z.string()).default([]),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative(),
});

export type RateRequest = z.infer<typeof RateRequestSchema>;

export function parseRateRequest(value: unknown): RateRequest {
  return RateRequestSchema.parse(value);
}

export function isRateRequestExpired(req: RateRequest, nowMs: number): boolean {
  return req.expiresAt <= nowMs;
}
