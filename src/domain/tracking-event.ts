// One tracking-event snapshot from a carrier. Append-only; the latest event
// is determined by `occurredAt` ordering, not by overwriting earlier ones.

import { z } from '../lib/validate';

export const TrackingStatus = z.enum([
  'pre_transit', 'in_transit', 'out_for_delivery', 'delivered',
  'exception', 'returned', 'cancelled',
]);
export type TrackingStatusValue = z.infer<typeof TrackingStatus>;

export const TrackingEventSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  trackingNumber: z.string().min(1).max(80),
  status: TrackingStatus,
  description: z.string().max(240),
  locationCity: z.string().max(80).optional(),
  locationRegion: z.string().max(80).optional(),
  locationCountry: z.string().length(2).optional(),
  occurredAt: z.number().int().nonnegative(),
  recordedAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
});

export type TrackingEvent = z.infer<typeof TrackingEventSchema>;

export function parseTrackingEvent(value: unknown): TrackingEvent {
  return TrackingEventSchema.parse(value);
}

export function isDeliveryEvent(event: TrackingEvent): boolean {
  return event.status === 'delivered';
}

export function isExceptionEvent(event: TrackingEvent): boolean {
  return event.status === 'exception';
}
