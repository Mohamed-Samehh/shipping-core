// Inbound return shipment. References the originating outbound shipment so
// the same customer / address pairing rolls through.

import { z } from '../lib/validate';

export const ReturnStatus = z.enum([
  'requested', 'approved', 'rejected', 'shipped', 'received', 'closed',
]);
export type ReturnStatusValue = z.infer<typeof ReturnStatus>;

export const ReturnReason = z.enum([
  'damaged', 'wrong_item', 'not_as_described', 'changed_mind',
  'late_delivery', 'no_longer_needed', 'defective', 'other',
]);
export type ReturnReasonValue = z.infer<typeof ReturnReason>;

export const ReturnSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  outboundShipmentId: z.string().min(1),
  returnShipmentId: z.string().min(1).optional(),
  status: ReturnStatus.default('requested'),
  reason: ReturnReason,
  reasonNote: z.string().max(280).optional(),
  refundAmount: z.bigint().optional(),
  refundCurrency: z.string().length(3).optional(),
  approvedAt: z.number().int().nonnegative().optional(),
  rejectedAt: z.number().int().nonnegative().optional(),
  receivedAt: z.number().int().nonnegative().optional(),
  closedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Return = z.infer<typeof ReturnSchema>;

export function parseReturn(value: unknown): Return {
  return ReturnSchema.parse(value);
}

export function isReturnOpen(value: Return): boolean {
  return value.status !== 'closed' && value.status !== 'rejected';
}
