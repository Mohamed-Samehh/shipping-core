// Delivery exception. Captures carrier-reported problems (address invalid,
// no recipient, weather hold) so support tooling can surface them.

import { z } from '../lib/validate';

export const ExceptionCategory = z.enum([
  'address_invalid', 'recipient_unavailable', 'damaged', 'lost',
  'weather', 'customs_hold', 'security_hold', 'mechanical_issue', 'other',
]);
export type ExceptionCategoryValue = z.infer<typeof ExceptionCategory>;

export const DeliveryExceptionSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  category: ExceptionCategory,
  code: z.string().max(40),
  description: z.string().max(280),
  resolvedAt: z.number().int().nonnegative().optional(),
  resolutionNote: z.string().max(280).optional(),
  occurredAt: z.number().int().nonnegative(),
  recordedAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
});

export type DeliveryException = z.infer<typeof DeliveryExceptionSchema>;

export function parseDeliveryException(value: unknown): DeliveryException {
  return DeliveryExceptionSchema.parse(value);
}

export function isExceptionResolved(exception: DeliveryException): boolean {
  return exception.resolvedAt !== undefined;
}
