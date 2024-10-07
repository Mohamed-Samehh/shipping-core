// Carrier shipping zone. Most carriers express their rate cards as a
// (origin postal-prefix, destination postal-prefix) -> zone number lookup;
// this entity caches the resolved zone.

import { z } from '../lib/validate';

export const ZoneSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  serviceId: z.string().min(1).optional(),
  originCountry: z.string().length(2),
  destinationCountry: z.string().length(2),
  originPrefix: z.string().min(1).max(8).optional(),
  destinationPrefix: z.string().min(1).max(8).optional(),
  zone: z.number().int().positive(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Zone = z.infer<typeof ZoneSchema>;

export function parseZone(value: unknown): Zone {
  return ZoneSchema.parse(value);
}

export function isDomestic(zone: Zone): boolean {
  return zone.originCountry === zone.destinationCountry;
}

export function zoneMatches(zone: Zone, originCountry: string, destinationCountry: string,
  originPostal?: string, destinationPostal?: string): boolean {
  if (zone.originCountry !== originCountry.toUpperCase()) return false;
  if (zone.destinationCountry !== destinationCountry.toUpperCase()) return false;
  if (zone.originPrefix && originPostal && !originPostal.startsWith(zone.originPrefix)) return false;
  if (zone.destinationPrefix && destinationPostal && !destinationPostal.startsWith(zone.destinationPrefix)) return false;
  return true;
}
