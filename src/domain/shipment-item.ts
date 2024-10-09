// Line item inside a shipment. Sums into customs declarations and into the
// shipping-level "contents" string carriers expect on the label.

import { z } from '../lib/validate';

export const ShipmentItemSchema = z.object({
  id: z.string().min(1),
  shipmentId: z.string().min(1),
  packageId: z.string().min(1).optional(),
  sku: z.string().max(64).optional(),
  description: z.string().min(1).max(240),
  quantity: z.number().int().positive(),
  unitWeightG: z.number().nonnegative(),
  unitValueAmount: z.bigint(),
  unitValueCurrency: z.string().length(3),
  countryOfOrigin: z.string().length(2).optional(),
  hsCode: z.string().regex(/^\d{6,10}$/).optional(),
  metadata: z.record(z.string()).default({}),
});

export type ShipmentItem = z.infer<typeof ShipmentItemSchema>;

export function parseShipmentItem(value: unknown): ShipmentItem {
  return ShipmentItemSchema.parse(value);
}

export function itemTotalValue(item: ShipmentItem): bigint {
  return item.unitValueAmount * BigInt(item.quantity);
}

export function itemTotalWeightG(item: ShipmentItem): number {
  return item.unitWeightG * item.quantity;
}
