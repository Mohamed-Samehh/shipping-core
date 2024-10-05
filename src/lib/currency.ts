// Minimal ISO 4217 currency table covering currencies the shipping integrations
// most often invoice in. Each entry exposes the minor-unit count for `money()`
// arithmetic plus the display symbol.

export interface CurrencyInfo {
  readonly code: string;
  readonly name: string;
  readonly minorUnits: number;
  readonly symbol: string;
}

const TABLE: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar',          minorUnits: 2, symbol: '$' },
  EUR: { code: 'EUR', name: 'Euro',               minorUnits: 2, symbol: '\u20ac' },
  GBP: { code: 'GBP', name: 'Pound Sterling',     minorUnits: 2, symbol: '\u00a3' },
  JPY: { code: 'JPY', name: 'Japanese Yen',       minorUnits: 0, symbol: '\u00a5' },
  CAD: { code: 'CAD', name: 'Canadian Dollar',    minorUnits: 2, symbol: 'C$' },
  AUD: { code: 'AUD', name: 'Australian Dollar',  minorUnits: 2, symbol: 'A$' },
  CHF: { code: 'CHF', name: 'Swiss Franc',        minorUnits: 2, symbol: 'CHF' },
  CNY: { code: 'CNY', name: 'Chinese Yuan',       minorUnits: 2, symbol: '\u00a5' },
  SEK: { code: 'SEK', name: 'Swedish Krona',      minorUnits: 2, symbol: 'kr' },
  NOK: { code: 'NOK', name: 'Norwegian Krone',    minorUnits: 2, symbol: 'kr' },
  DKK: { code: 'DKK', name: 'Danish Krone',       minorUnits: 2, symbol: 'kr' },
  MXN: { code: 'MXN', name: 'Mexican Peso',       minorUnits: 2, symbol: 'Mex$' },
  BRL: { code: 'BRL', name: 'Brazilian Real',     minorUnits: 2, symbol: 'R$' },
  INR: { code: 'INR', name: 'Indian Rupee',       minorUnits: 2, symbol: '\u20b9' },
  ZAR: { code: 'ZAR', name: 'South African Rand', minorUnits: 2, symbol: 'R' },
  AED: { code: 'AED', name: 'UAE Dirham',         minorUnits: 2, symbol: 'AED' },
  SGD: { code: 'SGD', name: 'Singapore Dollar',   minorUnits: 2, symbol: 'S$' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar',   minorUnits: 2, symbol: 'HK$' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', minorUnits: 2, symbol: 'NZ$' },
};

export function currencyInfo(code: string): CurrencyInfo {
  const info = TABLE[code.toUpperCase()];
  if (!info) throw new RangeError(`unknown currency: ${code}`);
  return info;
}

export function isKnownCurrency(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(TABLE, code.toUpperCase());
}

export function listCurrencies(): readonly CurrencyInfo[] {
  return Object.values(TABLE);
}

export function minorUnits(code: string): number {
  return currencyInfo(code).minorUnits;
}
