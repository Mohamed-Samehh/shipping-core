// Weight in grams + unit conversions. Storage form is always grams; the
// readable form is kg / lb / oz / g via the `formatWeight` helper.

export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

const TO_GRAMS: Record<WeightUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

export interface Weight {
  readonly grams: number;
}

export function weight(value: number, unit: WeightUnit = 'g'): Weight {
  if (!Number.isFinite(value)) throw new RangeError('weight value must be finite');
  if (value < 0) throw new RangeError('weight cannot be negative');
  if (!(unit in TO_GRAMS)) throw new RangeError(`unknown weight unit: ${unit}`);
  return { grams: value * TO_GRAMS[unit] };
}

export function toUnit(w: Weight, unit: WeightUnit): number {
  if (!(unit in TO_GRAMS)) throw new RangeError(`unknown weight unit: ${unit}`);
  return w.grams / TO_GRAMS[unit];
}

export function addWeight(a: Weight, b: Weight): Weight {
  return { grams: a.grams + b.grams };
}

export function subtractWeight(a: Weight, b: Weight): Weight {
  if (a.grams < b.grams) throw new RangeError('subtractWeight would underflow');
  return { grams: a.grams - b.grams };
}

export function compareWeight(a: Weight, b: Weight): number {
  if (a.grams < b.grams) return -1;
  if (a.grams > b.grams) return 1;
  return 0;
}

export function formatWeight(w: Weight, unit: WeightUnit, decimals = 2): string {
  return `${toUnit(w, unit).toFixed(decimals)} ${unit}`;
}

export function sumWeights(weights: readonly Weight[]): Weight {
  let grams = 0;
  for (const w of weights) grams += w.grams;
  return { grams };
}

export function maxWeight(weights: readonly Weight[]): Weight {
  if (weights.length === 0) throw new RangeError('maxWeight: empty array');
  let grams = -Infinity;
  for (const w of weights) if (w.grams > grams) grams = w.grams;
  return { grams };
}
