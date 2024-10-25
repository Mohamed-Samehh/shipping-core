// Multi-stop delivery / pickup route. Built by the dispatch service from a
// pickup window + a set of pickup requests.

import { z } from '../lib/validate';

export const RouteStatus = z.enum(['planned', 'in_progress', 'completed', 'cancelled']);
export type RouteStatusValue = z.infer<typeof RouteStatus>;

export const RouteSchema = z.object({
  id: z.string().min(1),
  driverId: z.string().min(1).optional(),
  vehicleId: z.string().min(1).optional(),
  status: RouteStatus.default('planned'),
  plannedStart: z.number().int().nonnegative(),
  plannedEnd: z.number().int().nonnegative(),
  startedAt: z.number().int().nonnegative().optional(),
  completedAt: z.number().int().nonnegative().optional(),
  stopIds: z.array(z.string()).default([]),
  totalDistanceKm: z.number().nonnegative().default(0),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Route = z.infer<typeof RouteSchema>;

export function parseRoute(value: unknown): Route {
  return RouteSchema.parse(value);
}

export function isRouteActive(route: Route): boolean {
  return route.status === 'planned' || route.status === 'in_progress';
}
