// Pre-allocated pickup slot. The dispatch service books these against pickup
// windows so the manifest creator knows in advance how many shipments fit.

import { z } from '../lib/validate';

export const DispatchSlotSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  locationId: z.string().min(1),
  windowStart: z.number().int().nonnegative(),
  windowEnd: z.number().int().nonnegative(),
  capacity: z.number().int().positive(),
  booked: z.number().int().nonnegative().default(0),
  manifestIds: z.array(z.string()).default([]),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type DispatchSlot = z.infer<typeof DispatchSlotSchema>;

export function parseDispatchSlot(value: unknown): DispatchSlot {
  return DispatchSlotSchema.parse(value);
}

export function isSlotFull(slot: DispatchSlot): boolean {
  return slot.booked >= slot.capacity;
}

export function slotRemainingCapacity(slot: DispatchSlot): number {
  return Math.max(0, slot.capacity - slot.booked);
}
