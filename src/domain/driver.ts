// Driver assignment. Each route ships with at most one driver record.

import { z } from '../lib/validate';

export const DriverStatus = z.enum(['active', 'inactive', 'suspended']);
export type DriverStatusValue = z.infer<typeof DriverStatus>;

export const DriverSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  licenseNumber: z.string().max(40).optional(),
  licenseExpiresAt: z.number().int().nonnegative().optional(),
  status: DriverStatus.default('active'),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Driver = z.infer<typeof DriverSchema>;

export function parseDriver(value: unknown): Driver {
  return DriverSchema.parse(value);
}

export function isDriverActive(driver: Driver): boolean {
  return driver.status === 'active';
}
