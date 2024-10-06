// Process-wide defaults for the shipping-core library. Production callers
// override individual fields via the service constructors; the defaults are
// what tests and quickstart scripts get without explicit wiring.

export interface ShippingConfig {
  readonly defaultCurrency: string;
  readonly defaultWeightUnit: 'kg' | 'lb' | 'g' | 'oz';
  readonly defaultDimensionUnit: 'cm' | 'in';
  readonly defaultDimFactor: number;
  readonly maxParcelWeightKg: number;
  readonly maxParcelLongestSideCm: number;
  readonly maxParcelGirthCm: number;
  readonly maxParcelsPerShipment: number;
  readonly manifestAutoCloseHours: number;
  readonly labelExpiryDays: number;
  readonly trackingPollIntervalSec: number;
  readonly webhookMaxRetries: number;
  readonly webhookRetryBackoffMs: number;
  readonly rateCacheTtlMs: number;
}

export const DEFAULT_CONFIG: ShippingConfig = {
  defaultCurrency: 'USD',
  defaultWeightUnit: 'kg',
  defaultDimensionUnit: 'cm',
  defaultDimFactor: 5000,
  maxParcelWeightKg: 70,
  maxParcelLongestSideCm: 274,
  maxParcelGirthCm: 419,
  maxParcelsPerShipment: 99,
  manifestAutoCloseHours: 24,
  labelExpiryDays: 28,
  trackingPollIntervalSec: 900,
  webhookMaxRetries: 8,
  webhookRetryBackoffMs: 30_000,
  rateCacheTtlMs: 5 * 60 * 1000,
};

export function mergeConfig(overrides: Partial<ShippingConfig>): ShippingConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

export function isFreightSize(longestSideCm: number, weightKg: number): boolean {
  return longestSideCm > 274 || weightKg > 70;
}
