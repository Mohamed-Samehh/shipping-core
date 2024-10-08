// A package is a single parcel inside a shipment. A shipment can have many
// packages; rates and labels are produced per-package.

import { z } from '../lib/validate';

export const PackageSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  reference: z.string().max(80).optional(),
  packageTypeId: z.string().min(1).optional(),
  lengthMm: z.number().positive(),
  widthMm: z.number().positive(),
  heightMm: z.number().positive(),
  weightG: z.number().positive(),
  declaredValueAmount: z.bigint().optional(),
  declaredValueCurrency: z.string().length(3).optional(),
  insuranceAmount: z.bigint().optional(),
  contentDescription: z.string().max(280).optional(),
  hsCode: z.string().regex(/^\d{6,10}$/).optional(),
  isHazmat: z.boolean().default(false),
  isFragile: z.boolean().default(false),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Package = z.infer<typeof PackageSchema>;

export function parsePackage(value: unknown): Package {
  return PackageSchema.parse(value);
}

export function packageVolumeMm3(pkg: Package): number {
  return pkg.lengthMm * pkg.widthMm * pkg.heightMm;
}

export function packageLongestSide(pkg: Package): number {
  return Math.max(pkg.lengthMm, pkg.widthMm, pkg.heightMm);
}

export function packageGirth(pkg: Package): number {
  return 2 * (pkg.widthMm + pkg.heightMm);
}

export function packageLengthPlusGirth(pkg: Package): number {
  return pkg.lengthMm + packageGirth(pkg);
}
