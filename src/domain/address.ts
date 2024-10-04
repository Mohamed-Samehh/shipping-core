// Postal address shape. Carriers validate against the country-specific
// postal-code pattern at create time so downstream rate / label calls don't
// have to revalidate.

import { z } from '../lib/validate';
import { isValidPostalCode, normalisePostalCode } from '../lib/postal-code';
import { isKnownCountry } from '../lib/country';

export const AddressSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  street1: z.string().min(1).max(120),
  street2: z.string().max(120).optional(),
  city: z.string().min(1).max(80),
  region: z.string().max(80).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().max(40).optional(),
  email: z.string().email().optional(),
  isResidential: z.boolean().default(false),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Address = z.infer<typeof AddressSchema>;

export function parseAddress(value: unknown): Address {
  return AddressSchema.parse(value);
}

export function normaliseAddress(address: Address): Address {
  return {
    ...address,
    country: address.country.toUpperCase(),
    postalCode: normalisePostalCode(address.country, address.postalCode),
  };
}

export function isValidAddress(address: Address): boolean {
  return isKnownCountry(address.country) && isValidPostalCode(address.country, address.postalCode);
}

export function isInternational(origin: Address, destination: Address): boolean {
  return origin.country.toUpperCase() !== destination.country.toUpperCase();
}
