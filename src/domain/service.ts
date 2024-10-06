// Carrier service offering (e.g. UPS Ground, FedEx Priority Overnight).
// Modelled separately from `Carrier` so a single carrier can expose many
// services with different transit-time and surcharge rules.

import { z } from '../lib/validate';

export const ServiceCategory = z.enum(['ground', 'express', 'overnight', 'economy', 'freight']);
export type ServiceCategoryValue = z.infer<typeof ServiceCategory>;

export const ServiceSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  code: z.string().min(2).max(32),
  name: z.string().min(1).max(120),
  category: ServiceCategory,
  guaranteedBy: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  transitDaysMin: z.number().int().nonnegative(),
  transitDaysMax: z.number().int().nonnegative(),
  weekendDelivery: z.boolean().default(false),
  signatureRequired: z.boolean().default(false),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Service = z.infer<typeof ServiceSchema>;

export function parseService(value: unknown): Service {
  return ServiceSchema.parse(value);
}

export function isService(value: unknown): value is Service {
  return ServiceSchema.safeParse(value).success;
}

export function isExpressCategory(service: Service): boolean {
  return service.category === 'express' || service.category === 'overnight';
}
