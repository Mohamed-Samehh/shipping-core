// A single stop on a route. Ordered by `sequence`; the dispatcher recomputes
// the sequence when the route is re-planned.

import { z } from '../lib/validate';

export const RouteStopType = z.enum(['pickup', 'delivery', 'return', 'transfer']);
export type RouteStopTypeValue = z.infer<typeof RouteStopType>;

export const RouteStopSchema = z.object({
  id: z.string().min(1),
  routeId: z.string().min(1),
  sequence: z.number().int().nonnegative(),
  kind: RouteStopType,
  addressId: z.string().min(1),
  pickupRequestId: z.string().min(1).optional(),
  shipmentId: z.string().min(1).optional(),
  windowStart: z.number().int().nonnegative(),
  windowEnd: z.number().int().nonnegative(),
  arrivedAt: z.number().int().nonnegative().optional(),
  completedAt: z.number().int().nonnegative().optional(),
  notes: z.string().max(280).optional(),
  metadata: z.record(z.string()).default({}),
});

export type RouteStop = z.infer<typeof RouteStopSchema>;

export function parseRouteStop(value: unknown): RouteStop {
  return RouteStopSchema.parse(value);
}

export function isStopCompleted(stop: RouteStop): boolean {
  return stop.completedAt !== undefined;
}
