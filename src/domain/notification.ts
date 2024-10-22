// Customer-facing notification sent for shipment lifecycle events (label
// issued, in transit, delivered). Storage form only -- delivery itself is
// handled by an external mailer.

import { z } from '../lib/validate';

export const NotificationChannel = z.enum(['email', 'sms', 'push', 'webhook']);
export type NotificationChannelValue = z.infer<typeof NotificationChannel>;

export const NotificationStatus = z.enum(['queued', 'sent', 'failed', 'suppressed']);
export type NotificationStatusValue = z.infer<typeof NotificationStatus>;

export const NotificationSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  shipmentId: z.string().min(1).optional(),
  channel: NotificationChannel,
  template: z.string().min(1).max(80),
  recipient: z.string().min(1).max(200),
  status: NotificationStatus.default('queued'),
  payload: z.record(z.unknown()).default({}),
  sentAt: z.number().int().nonnegative().optional(),
  failedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export function parseNotification(value: unknown): Notification {
  return NotificationSchema.parse(value);
}

export function isNotificationPending(notification: Notification): boolean {
  return notification.status === 'queued';
}
