// Shipment lifecycle: draft -> booked -> in_transit -> delivered (or
// cancelled / exception). All state changes go through `ShipmentService` so
// the audit log captures every transition.

import { z } from '../lib/validate';

export const ShipmentStatus = z.enum([
  'draft', 'rated', 'booked', 'manifested', 'in_transit',
  'delivered', 'exception', 'cancelled', 'returned',
]);
export type ShipmentStatusValue = z.infer<typeof ShipmentStatus>;

export const ShipmentSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  carrierId: z.string().min(1).optional(),
  serviceId: z.string().min(1).optional(),
  accountId: z.string().min(1).optional(),
  reference: z.string().max(80).optional(),
  status: ShipmentStatus.default('draft'),
  fromAddressId: z.string().min(1),
  toAddressId: z.string().min(1),
  returnAddressId: z.string().min(1).optional(),
  pickupRequestId: z.string().min(1).optional(),
  manifestId: z.string().min(1).optional(),
  trackingNumber: z.string().max(80).optional(),
  signatureRequired: z.boolean().default(false),
  saturdayDelivery: z.boolean().default(false),
  totalAmount: z.bigint().optional(),
  currency: z.string().length(3).optional(),
  metadata: z.record(z.string()).default({}),
  bookedAt: z.number().int().nonnegative().optional(),
  cancelledAt: z.number().int().nonnegative().optional(),
  deliveredAt: z.number().int().nonnegative().optional(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;

export function parseShipment(value: unknown): Shipment {
  return ShipmentSchema.parse(value);
}

const TERMINAL: ReadonlySet<Shipment['status']> = new Set(['delivered', 'cancelled', 'returned']);

export function isShipmentTerminal(shipment: Shipment): boolean {
  return TERMINAL.has(shipment.status);
}

export function isShipmentInTransit(shipment: Shipment): boolean {
  return shipment.status === 'in_transit';
}

export function canCancelShipment(shipment: Shipment): boolean {
  return shipment.status === 'draft' || shipment.status === 'rated' || shipment.status === 'booked';
}
