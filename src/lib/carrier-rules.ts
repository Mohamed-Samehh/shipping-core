// Carrier-specific operational rules. Most carriers have hard limits on
// parcel size / weight / contents; this module centralises the lookup so
// rate-shopping and label-issue can fail fast.

import { Dimensions } from './dimensions';
import { Weight } from './weight';

export interface CarrierLimits {
  readonly maxWeightG: number;
  readonly maxLongestSideMm: number;
  readonly maxLengthPlusGirthMm: number;
  readonly maxDeclaredValueUsd: bigint;
  readonly forbidsAlcohol: boolean;
  readonly forbidsLithium: boolean;
}

const LIMITS: Record<string, CarrierLimits> = {
  UPS:   { maxWeightG: 70_000, maxLongestSideMm: 2740, maxLengthPlusGirthMm: 4190, maxDeclaredValueUsd: 50_000_00n, forbidsAlcohol: true,  forbidsLithium: false },
  FEDEX: { maxWeightG: 68_000, maxLongestSideMm: 2740, maxLengthPlusGirthMm: 3300, maxDeclaredValueUsd: 50_000_00n, forbidsAlcohol: false, forbidsLithium: false },
  USPS:  { maxWeightG: 31_750, maxLongestSideMm: 1080, maxLengthPlusGirthMm: 2740, maxDeclaredValueUsd:  5_000_00n, forbidsAlcohol: true,  forbidsLithium: true  },
  DHL:   { maxWeightG: 70_000, maxLongestSideMm: 1200, maxLengthPlusGirthMm: 3000, maxDeclaredValueUsd: 25_000_00n, forbidsAlcohol: true,  forbidsLithium: false },
};

export function limitsFor(carrierCode: string): CarrierLimits {
  const lookup = LIMITS[carrierCode.toUpperCase()];
  if (!lookup) {
    throw new RangeError(`no carrier limits for ${carrierCode}`);
  }
  return lookup;
}

export interface ValidationFailure {
  readonly code: string;
  readonly message: string;
}

export function validate(carrierCode: string, dim: Dimensions, weight: Weight,
  declaredValueUsd: bigint): readonly ValidationFailure[] {
  const limits = limitsFor(carrierCode);
  const failures: ValidationFailure[] = [];
  if (weight.grams > limits.maxWeightG) {
    failures.push({ code: 'WEIGHT_TOO_HEAVY',
      message: `${weight.grams}g exceeds ${limits.maxWeightG}g for ${carrierCode}` });
  }
  const longest = Math.max(dim.lengthMm, dim.widthMm, dim.heightMm);
  if (longest > limits.maxLongestSideMm) {
    failures.push({ code: 'DIMENSION_TOO_LONG',
      message: `${longest}mm exceeds ${limits.maxLongestSideMm}mm for ${carrierCode}` });
  }
  const lpg = dim.lengthMm + 2 * (dim.widthMm + dim.heightMm);
  if (lpg > limits.maxLengthPlusGirthMm) {
    failures.push({ code: 'DIMENSION_LENGTH_PLUS_GIRTH',
      message: `L+G ${lpg}mm exceeds ${limits.maxLengthPlusGirthMm}mm for ${carrierCode}` });
  }
  if (declaredValueUsd > limits.maxDeclaredValueUsd) {
    failures.push({ code: 'DECLARED_VALUE_TOO_HIGH',
      message: `declared $${declaredValueUsd / 100n} exceeds limit for ${carrierCode}` });
  }
  return failures;
}

export function isUsable(carrierCode: string, dim: Dimensions, weight: Weight,
  declaredValueUsd: bigint = 0n): boolean {
  return validate(carrierCode, dim, weight, declaredValueUsd).length === 0;
}

export function supportedCarriers(): readonly string[] {
  return Object.keys(LIMITS);
}
