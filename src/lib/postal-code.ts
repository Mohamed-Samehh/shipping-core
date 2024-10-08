// Postal-code validation. Carriers reject shipments with malformed postal
// codes early; we validate at the address-attach step.

const PATTERNS: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
  GB: /^([A-Z]{1,2}\d[A-Z\d]?|[A-Z]{1,2}\d{1,2}|GIR ?0AA) ?\d[A-Z]{2}$/i,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  ES: /^\d{5}$/,
  IT: /^\d{5}$/,
  NL: /^\d{4} ?[A-Z]{2}$/i,
  BE: /^\d{4}$/,
  AT: /^\d{4}$/,
  CH: /^\d{4}$/,
  PT: /^\d{4}(-\d{3})?$/,
  IE: /^[A-Z]\d{2} ?[A-Z\d]{4}$/i,
  AU: /^\d{4}$/,
  NZ: /^\d{4}$/,
  JP: /^\d{3}-?\d{4}$/,
  CN: /^\d{6}$/,
  IN: /^\d{6}$/,
  BR: /^\d{5}-?\d{3}$/,
  MX: /^\d{5}$/,
  SE: /^\d{3} ?\d{2}$/,
  NO: /^\d{4}$/,
  DK: /^\d{4}$/,
  FI: /^\d{5}$/,
};

export function isValidPostalCode(country: string, value: string): boolean {
  const pattern = PATTERNS[country.toUpperCase()];
  if (!pattern) return value.length > 0 && value.length <= 16;
  return pattern.test(value.trim());
}

export function normalisePostalCode(country: string, value: string): string {
  const trimmed = value.trim().toUpperCase();
  switch (country.toUpperCase()) {
    case 'CA': return trimmed.replace(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/, '$1 $2').replace(/  +/g, ' ');
    case 'GB': return trimmed.replace(/  +/g, ' ');
    case 'BR': return trimmed.length === 8 ? `${trimmed.slice(0, 5)}-${trimmed.slice(5)}` : trimmed;
    case 'JP': return trimmed.length === 7 ? `${trimmed.slice(0, 3)}-${trimmed.slice(3)}` : trimmed;
    case 'PT': return trimmed.length === 7 ? `${trimmed.slice(0, 4)}-${trimmed.slice(4)}` : trimmed;
    default: return trimmed;
  }
}

export function supportedCountries(): readonly string[] {
  return Object.keys(PATTERNS);
}
