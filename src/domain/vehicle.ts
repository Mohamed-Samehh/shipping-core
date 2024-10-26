// Dispatch vehicle. The router picks one whose capacity fits the day's
// shipments.

import { z } from '../lib/validate';

export const VehicleKind = z.enum(['van', 'truck', 'cargo_bike', 'motorbike']);
export type VehicleKindValue = z.infer<typeof VehicleKind>;

export const VehicleSchema = z.object({
  id: z.string().min(1),
  registration: z.string().min(2).max(24),
  kind: VehicleKind,
  capacityWeightG: z.number().positive(),
  capacityVolumeMm3: z.number().positive(),
  homeLocationId: z.string().min(1).optional(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

export function parseVehicle(value: unknown): Vehicle {
  return VehicleSchema.parse(value);
}

export function isVehicleUsable(vehicle: Vehicle): boolean {
  return vehicle.enabled;
}
