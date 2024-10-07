// Reusable package type definition. Customers register the box sizes they
// pack into so rate requests can pre-fill dimensions when the caller passes
// the type code instead of explicit dimensions.

import { z } from '../lib/validate';

export const PackageTypeKind = z.enum(['box', 'envelope', 'tube', 'pallet', 'soft-pack']);
export type PackageTypeKindValue = z.infer<typeof PackageTypeKind>;

export const PackageTypeSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(2).max(24),
  name: z.string().min(1).max(80),
  kind: PackageTypeKind,
  lengthMm: z.number().positive(),
  widthMm: z.number().positive(),
  heightMm: z.number().positive(),
  emptyWeightG: z.number().nonnegative(),
  maxWeightG: z.number().positive(),
  carrierIds: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type PackageType = z.infer<typeof PackageTypeSchema>;

export function parsePackageType(value: unknown): PackageType {
  return PackageTypeSchema.parse(value);
}

export function isPackageTypeUsable(pt: PackageType): boolean {
  return pt.enabled;
}

export function fitsWeight(pt: PackageType, contentWeightG: number): boolean {
  return pt.emptyWeightG + contentWeightG <= pt.maxWeightG;
}
