// IATA / DOT-style hazardous-material declaration. Carriers refuse parcels
// without one when shipping anything in the regulated categories.

import { z } from '../lib/validate';

export const HazmatClass = z.enum([
  '1', '2.1', '2.2', '2.3', '3', '4.1', '4.2', '4.3', '5.1', '5.2',
  '6.1', '6.2', '7', '8', '9',
]);
export type HazmatClassValue = z.infer<typeof HazmatClass>;

export const HazmatDeclarationSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  unNumber: z.string().regex(/^UN\d{4}$/),
  properShippingName: z.string().min(1).max(200),
  hazardClass: HazmatClass,
  packingGroup: z.enum(['I', 'II', 'III']).optional(),
  packagingInstruction: z.string().max(80).optional(),
  netQuantityG: z.number().positive(),
  signedBy: z.string().max(120),
  signedAt: z.number().int().nonnegative(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
});

export type HazmatDeclaration = z.infer<typeof HazmatDeclarationSchema>;

export function parseHazmatDeclaration(value: unknown): HazmatDeclaration {
  return HazmatDeclarationSchema.parse(value);
}

export function isHighRisk(declaration: HazmatDeclaration): boolean {
  return declaration.hazardClass === '1'
    || declaration.hazardClass === '7'
    || declaration.hazardClass.startsWith('2.3');
}
