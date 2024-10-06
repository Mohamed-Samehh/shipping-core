// Carrier account. Maps a customer-side identifier to an upstream carrier
// account; rate-shopping decides which account to charge a given shipment to.

import { z } from '../lib/validate';

export const AccountStatus = z.enum(['active', 'suspended', 'closed']);
export type AccountStatusValue = z.infer<typeof AccountStatus>;

export const AccountSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  externalRef: z.string().max(120),
  alias: z.string().min(1).max(80),
  status: AccountStatus.default('active'),
  countryFilter: z.array(z.string().length(2)).default([]),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Account = z.infer<typeof AccountSchema>;

export function parseAccount(value: unknown): Account {
  return AccountSchema.parse(value);
}

export function isAccountUsable(account: Account): boolean {
  return account.status === 'active';
}

export function accountFitsCountry(account: Account, country: string): boolean {
  if (account.countryFilter.length === 0) return true;
  return account.countryFilter.includes(country.toUpperCase());
}
