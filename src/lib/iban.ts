// Lightweight IBAN validation. The shipping integrations sometimes invoice in
// EU markets that pay via SEPA -- IBANs land on customer records and we need
// to reject obvious typos at boundary input.

const COUNTRY_LENGTHS: Record<string, number> = {
  AD: 24, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28,
  CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29,
  ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27,
  GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30,
  KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24,
  ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28,
  PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SC: 31, SE: 24, SI: 19,
  SK: 24, SM: 27, ST: 25, TL: 23, TN: 24, TR: 26, UA: 29, VG: 24, XK: 20,
};

export function normaliseIban(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

export function isValidIban(value: string): boolean {
  const normalised = normaliseIban(value);
  if (normalised.length < 4) return false;
  const country = normalised.slice(0, 2);
  const expected = COUNTRY_LENGTHS[country];
  if (expected === undefined) return false;
  if (normalised.length !== expected) return false;
  if (!/^[A-Z0-9]+$/.test(normalised)) return false;
  return ibanMod97(normalised) === 1;
}

function ibanMod97(value: string): number {
  const rearranged = value.slice(4) + value.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digit = ch >= '0' && ch <= '9'
      ? ch.charCodeAt(0) - 48
      : ch.charCodeAt(0) - 55; // A=10
    if (digit < 0 || digit > 35) return -1;
    if (digit < 10) {
      remainder = (remainder * 10 + digit) % 97;
    } else {
      remainder = (remainder * 100 + digit) % 97;
    }
  }
  return remainder;
}

export function formatIban(value: string): string {
  const normalised = normaliseIban(value);
  return normalised.match(/.{1,4}/g)?.join(' ') ?? normalised;
}
