// ISO 3166-1 alpha-2 country table covering the markets shipping-core is
// integrated with. Only the fields the rest of the library actually reads.

export interface CountryInfo {
  readonly code: string;        // ISO 3166-1 alpha-2
  readonly name: string;
  readonly currency: string;    // ISO 4217
  readonly euMember: boolean;
  readonly requiresCustoms: boolean;
  readonly callingCode: string;
}

const TABLE: Record<string, CountryInfo> = {
  US: { code: 'US', name: 'United States',  currency: 'USD', euMember: false, requiresCustoms: false, callingCode: '1' },
  CA: { code: 'CA', name: 'Canada',         currency: 'CAD', euMember: false, requiresCustoms: true,  callingCode: '1' },
  MX: { code: 'MX', name: 'Mexico',         currency: 'MXN', euMember: false, requiresCustoms: true,  callingCode: '52' },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', euMember: false, requiresCustoms: true,  callingCode: '44' },
  IE: { code: 'IE', name: 'Ireland',        currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '353' },
  DE: { code: 'DE', name: 'Germany',        currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '49' },
  FR: { code: 'FR', name: 'France',         currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '33' },
  IT: { code: 'IT', name: 'Italy',          currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '39' },
  ES: { code: 'ES', name: 'Spain',          currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '34' },
  NL: { code: 'NL', name: 'Netherlands',    currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '31' },
  BE: { code: 'BE', name: 'Belgium',        currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '32' },
  AT: { code: 'AT', name: 'Austria',        currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '43' },
  CH: { code: 'CH', name: 'Switzerland',    currency: 'CHF', euMember: false, requiresCustoms: true,  callingCode: '41' },
  SE: { code: 'SE', name: 'Sweden',         currency: 'SEK', euMember: true,  requiresCustoms: false, callingCode: '46' },
  NO: { code: 'NO', name: 'Norway',         currency: 'NOK', euMember: false, requiresCustoms: true,  callingCode: '47' },
  DK: { code: 'DK', name: 'Denmark',        currency: 'DKK', euMember: true,  requiresCustoms: false, callingCode: '45' },
  FI: { code: 'FI', name: 'Finland',        currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '358' },
  PT: { code: 'PT', name: 'Portugal',       currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '351' },
  PL: { code: 'PL', name: 'Poland',         currency: 'EUR', euMember: true,  requiresCustoms: false, callingCode: '48' },
  AU: { code: 'AU', name: 'Australia',      currency: 'AUD', euMember: false, requiresCustoms: true,  callingCode: '61' },
  NZ: { code: 'NZ', name: 'New Zealand',    currency: 'NZD', euMember: false, requiresCustoms: true,  callingCode: '64' },
  JP: { code: 'JP', name: 'Japan',          currency: 'JPY', euMember: false, requiresCustoms: true,  callingCode: '81' },
  CN: { code: 'CN', name: 'China',          currency: 'CNY', euMember: false, requiresCustoms: true,  callingCode: '86' },
  HK: { code: 'HK', name: 'Hong Kong',      currency: 'HKD', euMember: false, requiresCustoms: true,  callingCode: '852' },
  SG: { code: 'SG', name: 'Singapore',      currency: 'SGD', euMember: false, requiresCustoms: true,  callingCode: '65' },
  IN: { code: 'IN', name: 'India',          currency: 'INR', euMember: false, requiresCustoms: true,  callingCode: '91' },
  BR: { code: 'BR', name: 'Brazil',         currency: 'BRL', euMember: false, requiresCustoms: true,  callingCode: '55' },
  ZA: { code: 'ZA', name: 'South Africa',   currency: 'ZAR', euMember: false, requiresCustoms: true,  callingCode: '27' },
  AE: { code: 'AE', name: 'UAE',            currency: 'AED', euMember: false, requiresCustoms: true,  callingCode: '971' },
};

export function countryInfo(code: string): CountryInfo {
  const info = TABLE[code.toUpperCase()];
  if (!info) throw new RangeError(`unknown country: ${code}`);
  return info;
}

export function isKnownCountry(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(TABLE, code.toUpperCase());
}

export function isEuMember(code: string): boolean {
  return countryInfo(code).euMember;
}

export function requiresCustoms(origin: string, destination: string): boolean {
  if (origin === destination) return false;
  const o = countryInfo(origin);
  const d = countryInfo(destination);
  if (o.euMember && d.euMember) return false;
  return o.requiresCustoms || d.requiresCustoms || origin !== destination;
}

export function listCountries(): readonly CountryInfo[] {
  return Object.values(TABLE);
}
