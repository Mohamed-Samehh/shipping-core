// Customer root entity. A customer owns shipments, contracts, accounts and
// addresses.

import { z } from '../lib/validate';

export const CustomerStatus = z.enum(['active', 'paused', 'closed']);
export type CustomerStatusValue = z.infer<typeof CustomerStatus>;

export const CustomerSchema = z.object({
  id: z.string().min(1),
  externalRef: z.string().max(100).optional(),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  status: CustomerStatus.default('active'),
  defaultCurrency: z.string().length(3),
  defaultLocationId: z.string().min(1).optional(),
  contractIds: z.array(z.string()).default([]),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export function parseCustomer(value: unknown): Customer {
  return CustomerSchema.parse(value);
}

export function isCustomerActive(customer: Customer): boolean {
  return customer.status === 'active';
}
