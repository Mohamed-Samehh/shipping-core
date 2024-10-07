// Dimensional ("dim") weight conversion. Carriers compute billable weight as
// `max(actualKg, volumeCm3 / dimFactor)` where the dim factor varies per
// carrier / service.

import { Dimensions, volumeMm3 } from './dimensions';
import { Weight, weight } from './weight';

export function dimensionalWeight(dim: Dimensions, dimFactor: number): Weight {
  if (dimFactor <= 0) throw new RangeError('dimFactor must be > 0');
  const volumeCm3 = volumeMm3(dim) / 1000;
  const kg = volumeCm3 / dimFactor;
  return weight(kg, 'kg');
}

export function billableWeight(dim: Dimensions, actual: Weight, dimFactor: number): Weight {
  const dimW = dimensionalWeight(dim, dimFactor);
  return dimW.grams > actual.grams ? dimW : actual;
}

export function dimRatio(dim: Dimensions, actual: Weight, dimFactor: number): number {
  if (actual.grams === 0) return Infinity;
  return dimensionalWeight(dim, dimFactor).grams / actual.grams;
}

export function exceedsDim(dim: Dimensions, actual: Weight, dimFactor: number): boolean {
  return dimensionalWeight(dim, dimFactor).grams > actual.grams;
}
