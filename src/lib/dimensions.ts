// Parcel dimensions in millimetres. Storage form is mm; readable form is
// cm/in via the helpers.

export type DimensionUnit = 'mm' | 'cm' | 'in';

const TO_MM: Record<DimensionUnit, number> = {
  mm: 1,
  cm: 10,
  in: 25.4,
};

export interface Dimensions {
  readonly lengthMm: number;
  readonly widthMm: number;
  readonly heightMm: number;
}

export function dimensions(length: number, width: number, height: number,
  unit: DimensionUnit = 'mm'): Dimensions {
  for (const v of [length, width, height]) {
    if (!Number.isFinite(v) || v <= 0) throw new RangeError('dimensions must be positive finite');
  }
  if (!(unit in TO_MM)) throw new RangeError(`unknown unit: ${unit}`);
  const factor = TO_MM[unit];
  return { lengthMm: length * factor, widthMm: width * factor, heightMm: height * factor };
}

export function girth(d: Dimensions): number {
  return 2 * (d.widthMm + d.heightMm);
}

export function lengthPlusGirth(d: Dimensions): number {
  return d.lengthMm + girth(d);
}

export function volumeMm3(d: Dimensions): number {
  return d.lengthMm * d.widthMm * d.heightMm;
}

export function longestSide(d: Dimensions): number {
  return Math.max(d.lengthMm, d.widthMm, d.heightMm);
}

export function toUnit(d: Dimensions, unit: DimensionUnit): { length: number; width: number; height: number } {
  const factor = TO_MM[unit];
  return { length: d.lengthMm / factor, width: d.widthMm / factor, height: d.heightMm / factor };
}

export function isOversize(d: Dimensions, maxLongestMm: number, maxLengthPlusGirthMm: number): boolean {
  return longestSide(d) > maxLongestMm || lengthPlusGirth(d) > maxLengthPlusGirthMm;
}
