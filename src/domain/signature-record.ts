// Signature collected at delivery time. The label service can require this
// for high-value shipments.

import { z } from '../lib/validate';

export const SignatureType = z.enum(['direct', 'indirect', 'adult', 'no_signature']);
export type SignatureTypeValue = z.infer<typeof SignatureType>;

export const SignatureRecordSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  type: SignatureType,
  signedBy: z.string().max(120),
  signatureUrl: z.string().url().optional(),
  signedAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
});

export type SignatureRecord = z.infer<typeof SignatureRecordSchema>;

export function parseSignatureRecord(value: unknown): SignatureRecord {
  return SignatureRecordSchema.parse(value);
}

export function requiresAdult(record: SignatureRecord): boolean {
  return record.type === 'adult';
}
