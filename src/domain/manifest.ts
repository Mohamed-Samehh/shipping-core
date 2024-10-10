// End-of-day manifest. Carriers expect a single manifest document per pickup
// listing every shipment going out on that wave. The manifest service closes
// the manifest once dispatched; once closed, no shipments can be added.

import { z } from '../lib/validate';

export const ManifestStatus = z.enum(['open', 'closed', 'dispatched', 'cancelled']);
export type ManifestStatusValue = z.infer<typeof ManifestStatus>;

export const ManifestSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  accountId: z.string().min(1),
  locationId: z.string().min(1),
  status: ManifestStatus.default('open'),
  pickupRequestId: z.string().min(1).optional(),
  dispatchAt: z.number().int().nonnegative().optional(),
  closedAt: z.number().int().nonnegative().optional(),
  dispatchedAt: z.number().int().nonnegative().optional(),
  totalShipments: z.number().int().nonnegative().default(0),
  totalWeightG: z.number().nonnegative().default(0),
  totalAmount: z.bigint().optional(),
  currency: z.string().length(3).optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Manifest = z.infer<typeof ManifestSchema>;

export function parseManifest(value: unknown): Manifest {
  return ManifestSchema.parse(value);
}

export function isManifestOpen(manifest: Manifest): boolean {
  return manifest.status === 'open';
}

export function isManifestClosed(manifest: Manifest): boolean {
  return manifest.status === 'closed' || manifest.status === 'dispatched';
}

export function isManifestDispatched(manifest: Manifest): boolean {
  return manifest.status === 'dispatched';
}
