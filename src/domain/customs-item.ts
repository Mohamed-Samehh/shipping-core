// Line item on a customs declaration. Mirrors `ShipmentItem` but with the
// extra fields a customs broker needs (HS, country of origin, value with
// declared currency).

import { z } from '../lib/validate';

export const CustomsItemSchema = z.object({
  id: z.string().min(1),
  declarationId: z.string().min(1),
  shipmentItemId: z.string().min(1).optional(),
  description: z.string().min(1).max(240),
  hsCode: z.string().regex(/^\d{6,10}$/),
  countryOfOrigin: z.string().length(2),
  quantity: z.number().int().positive(),
  unitValueAmount: z.bigint(),
  unitValueCurrency: z.string().length(3),
  unitWeightG: z.number().nonnegative(),
  metadata: z.record(z.string()).default({}),
});

export type CustomsItem = z.infer<typeof CustomsItemSchema>;

export function parseCustomsItem(value: unknown): CustomsItem {
  return CustomsItemSchema.parse(value);
}

export function customsItemTotalValue(item: CustomsItem): bigint {
  return item.unitValueAmount * BigInt(item.quantity);
}
