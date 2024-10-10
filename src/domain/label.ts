// Shipping label. Produced once the carrier has accepted the rate and issued
// a tracking number. PDF / ZPL bytes themselves live in object storage; this
// entity is just the metadata + URL pointer.

import { z } from '../lib/validate';

export const LabelFormat = z.enum(['pdf', 'zpl', 'png']);
export type LabelFormatValue = z.infer<typeof LabelFormat>;

export const LabelStatus = z.enum(['issued', 'voided', 'expired']);
export type LabelStatusValue = z.infer<typeof LabelStatus>;

export const LabelSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  packageId: z.string().min(1),
  trackingNumber: z.string().min(1).max(80),
  format: LabelFormat,
  status: LabelStatus.default('issued'),
  url: z.string().url(),
  expiresAt: z.number().int().nonnegative(),
  sizeBytes: z.number().int().nonnegative().optional(),
  voidReason: z.string().max(120).optional(),
  voidedAt: z.number().int().nonnegative().optional(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Label = z.infer<typeof LabelSchema>;

export function parseLabel(value: unknown): Label {
  return LabelSchema.parse(value);
}

export function isLabelActive(label: Label, nowMs: number): boolean {
  return label.status === 'issued' && label.expiresAt > nowMs;
}

export function isLabelVoidable(label: Label): boolean {
  return label.status === 'issued';
}
