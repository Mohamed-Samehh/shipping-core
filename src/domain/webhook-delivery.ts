// A single delivery attempt against a webhook endpoint. The dispatcher inserts
// one record per attempt so failed deliveries can be retried with their own
// idempotency key.

import { z } from '../lib/validate';

export const WebhookDeliveryStatus = z.enum(['pending', 'delivered', 'failed', 'gave_up']);
export type WebhookDeliveryStatusValue = z.infer<typeof WebhookDeliveryStatus>;

export const WebhookDeliverySchema = z.object({
  id: z.string().min(1),
  endpointId: z.string().min(1),
  eventName: z.string().min(1).max(80),
  payload: z.string(),
  status: WebhookDeliveryStatus.default('pending'),
  attempt: z.number().int().nonnegative().default(0),
  maxAttempts: z.number().int().positive().default(8),
  nextAttemptAt: z.number().int().nonnegative().optional(),
  lastResponseStatus: z.number().int().nonnegative().optional(),
  lastResponseBody: z.string().max(2000).optional(),
  deliveredAt: z.number().int().nonnegative().optional(),
  gaveUpAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type WebhookDelivery = z.infer<typeof WebhookDeliverySchema>;

export function parseWebhookDelivery(value: unknown): WebhookDelivery {
  return WebhookDeliverySchema.parse(value);
}

export function isDeliveryTerminal(delivery: WebhookDelivery): boolean {
  return delivery.status === 'delivered' || delivery.status === 'gave_up';
}

export function canRetry(delivery: WebhookDelivery): boolean {
  return delivery.status === 'pending' && delivery.attempt < delivery.maxAttempts;
}
