// Carrier metadata. Service / Account / Rate / Shipment all carry a
// `carrierId` so the dispatch layer can fan rate-shopping requests across
// every active carrier without hard-coding.

import { z } from '../lib/validate';

export const CarrierMode = z.enum(['parcel', 'ltl', 'freight', 'mail']);
export type CarrierModeValue = z.infer<typeof CarrierMode>;

export const CarrierSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(2).max(16),
  name: z.string().min(1).max(120),
  mode: CarrierMode,
  enabled: z.boolean().default(true),
  supportedCountries: z.array(z.string().length(2)).min(1),
  supportsCustoms: z.boolean().default(false),
  supportsHazmat: z.boolean().default(false),
  apiBaseUrl: z.string().url().optional(),
  webhookSecret: z.string().min(8).optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Carrier = z.infer<typeof CarrierSchema>;

export function parseCarrier(value: unknown): Carrier {
  return CarrierSchema.parse(value);
}

export function isCarrierEnabled(carrier: Carrier): boolean {
  return carrier.enabled;
}

export function supportsCountry(carrier: Carrier, country: string): boolean {
  return carrier.supportedCountries.includes(country.toUpperCase());
}
