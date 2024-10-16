// Pickup request. The dispatcher books these with carriers ahead of the
// cut-off and the manifest dispatch ties shipments to a request.

import { z } from '../lib/validate';

export const PickupStatus = z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'missed']);
export type PickupStatusValue = z.infer<typeof PickupStatus>;

export const PickupRequestSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  addressId: z.string().min(1),
  status: PickupStatus.default('scheduled'),
  requestedWindowStart: z.number().int().nonnegative(),
  requestedWindowEnd: z.number().int().nonnegative(),
  confirmationNumber: z.string().max(80).optional(),
  totalShipments: z.number().int().nonnegative().default(0),
  totalWeightG: z.number().nonnegative().default(0),
  driverNote: z.string().max(280).optional(),
  cancelledAt: z.number().int().nonnegative().optional(),
  completedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type PickupRequest = z.infer<typeof PickupRequestSchema>;

export function parsePickupRequest(value: unknown): PickupRequest {
  return PickupRequestSchema.parse(value);
}

export function isPickupActive(req: PickupRequest): boolean {
  return req.status === 'scheduled' || req.status === 'confirmed';
}

export function isPickupTerminal(req: PickupRequest): boolean {
  return req.status === 'completed' || req.status === 'cancelled' || req.status === 'missed';
}
