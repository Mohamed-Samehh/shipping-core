// Customs declaration for international shipments. References `CustomsItem`
// rows for the line breakdown -- the same way invoices reference line items.

import { z } from '../lib/validate';

export const CustomsType = z.enum(['gift', 'sample', 'merchandise', 'documents', 'return']);
export type CustomsTypeValue = z.infer<typeof CustomsType>;

export const CustomsDeclarationSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  type: CustomsType,
  incoterm: z.string().min(3).max(8).default('DAP'),
  exporterId: z.string().min(1).optional(),
  importerId: z.string().min(1).optional(),
  totalAmount: z.bigint().optional(),
  currency: z.string().length(3).optional(),
  reasonForExport: z.string().max(200).optional(),
  signature: z.string().max(120).optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type CustomsDeclaration = z.infer<typeof CustomsDeclarationSchema>;

export function parseCustomsDeclaration(value: unknown): CustomsDeclaration {
  return CustomsDeclarationSchema.parse(value);
}

export function isGift(declaration: CustomsDeclaration): boolean {
  return declaration.type === 'gift';
}
