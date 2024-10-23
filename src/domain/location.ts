// Customer warehouse / fulfilment location. Pickup requests reference one of
// these so the carrier knows where to send the driver.

import { z } from '../lib/validate';

export const LocationKind = z.enum(['warehouse', '3pl', 'store', 'office', 'drop']);
export type LocationKindValue = z.infer<typeof LocationKind>;

export const LocationSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  code: z.string().min(2).max(24),
  name: z.string().min(1).max(120),
  kind: LocationKind,
  addressId: z.string().min(1),
  pickupCutoffLocal: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1).max(64),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Location = z.infer<typeof LocationSchema>;

export function parseLocation(value: unknown): Location {
  return LocationSchema.parse(value);
}

export function isLocationOpen(location: Location): boolean {
  return location.enabled;
}
