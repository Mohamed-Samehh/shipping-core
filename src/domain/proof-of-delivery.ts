// Proof of delivery. Generated when the carrier marks the shipment delivered;
// links to signature / photo blobs in object storage.

import { z } from '../lib/validate';

export const ProofOfDeliverySchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  trackingNumber: z.string().min(1).max(80),
  signedBy: z.string().max(120).optional(),
  signatureUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  deliveredAt: z.number().int().nonnegative(),
  recordedAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
});

export type ProofOfDelivery = z.infer<typeof ProofOfDeliverySchema>;

export function parseProofOfDelivery(value: unknown): ProofOfDelivery {
  return ProofOfDeliverySchema.parse(value);
}

export function hasSignature(pod: ProofOfDelivery): boolean {
  return Boolean(pod.signedBy && pod.signatureUrl);
}
