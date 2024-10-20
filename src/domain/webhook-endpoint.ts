// Subscription target for outbound shipment events.

import { z } from '../lib/validate';

export const WebhookEndpointSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  url: z.string().url(),
  secret: z.string().min(16),
  events: z.array(z.string()).min(1),
  enabled: z.boolean().default(true),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type WebhookEndpoint = z.infer<typeof WebhookEndpointSchema>;

export function parseWebhookEndpoint(value: unknown): WebhookEndpoint {
  return WebhookEndpointSchema.parse(value);
}

export function isEndpointActive(endpoint: WebhookEndpoint): boolean {
  return endpoint.enabled;
}

export function endpointAcceptsEvent(endpoint: WebhookEndpoint, eventName: string): boolean {
  if (!endpoint.enabled) return false;
  return endpoint.events.includes('*') || endpoint.events.includes(eventName);
}
