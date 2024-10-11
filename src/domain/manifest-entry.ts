// One shipment's appearance on a manifest. Kept as a separate entity (rather
// than a list field on `Manifest`) so the manifest stays cheap to look up while
// supporting tens of thousands of shipments per day.

import { z } from '../lib/validate';

export const ManifestEntrySchema = z.object({
  id: z.string().min(1),
  manifestId: z.string().min(1),
  shipmentId: z.string().min(1),
  trackingNumber: z.string().min(1).max(80),
  weightG: z.number().nonnegative(),
  addedAt: z.number().int().nonnegative(),
  removedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
});

export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export function parseManifestEntry(value: unknown): ManifestEntry {
  return ManifestEntrySchema.parse(value);
}

export function isEntryActive(entry: ManifestEntry): boolean {
  return entry.removedAt === undefined;
}
