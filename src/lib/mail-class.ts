// Postal mail class detection. Used by integrations that pre-print postage
// to know which class to apply.

import { Weight } from './weight';
import { Dimensions, longestSide } from './dimensions';

export type MailClass =
  | 'first-class-letter'
  | 'first-class-flat'
  | 'first-class-parcel'
  | 'priority-mail'
  | 'priority-mail-express'
  | 'media-mail'
  | 'parcel-select'
  | 'international-priority';

export interface MailClassOptions {
  readonly isInternational: boolean;
  readonly isMedia?: boolean;
  readonly preferExpress?: boolean;
}

export function detectMailClass(dim: Dimensions, weight: Weight,
  options: MailClassOptions): MailClass {
  if (options.isInternational) return 'international-priority';
  if (options.preferExpress) return 'priority-mail-express';
  if (options.isMedia) return 'media-mail';
  const longest = longestSide(dim);
  const grams = weight.grams;
  if (grams <= 100 && longest <= 305) return 'first-class-letter';
  if (grams <= 400 && longest <= 380) return 'first-class-flat';
  if (grams <= 6_000) return 'first-class-parcel';
  if (grams <= 31_750) return 'priority-mail';
  return 'parcel-select';
}

export function maxWeightFor(mailClass: MailClass): number {
  switch (mailClass) {
    case 'first-class-letter': return 100;
    case 'first-class-flat': return 400;
    case 'first-class-parcel': return 6_000;
    case 'priority-mail': return 31_750;
    case 'priority-mail-express': return 31_750;
    case 'media-mail': return 31_750;
    case 'parcel-select': return 31_750;
    case 'international-priority': return 31_750;
  }
}
