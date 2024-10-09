// Luhn checksum used to validate the carrier account numbers that some
// integrations issue in a PAN-like format.

export function isValidLuhn(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 2) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i] as string);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function maskPan(value: string, visible = 4): string {
  const digits = value.replace(/\s+/g, '');
  if (digits.length <= visible) return digits;
  return '*'.repeat(digits.length - visible) + digits.slice(-visible);
}

export function detectBrand(value: string): string | undefined {
  const digits = value.replace(/\D/g, '');
  if (/^4\d{12}(\d{3})?$/.test(digits)) return 'visa';
  if (/^5[1-5]\d{14}$/.test(digits)) return 'mastercard';
  if (/^3[47]\d{13}$/.test(digits)) return 'amex';
  if (/^6(?:011|5\d{2})\d{12}$/.test(digits)) return 'discover';
  if (/^3(?:0[0-5]|[68]\d)\d{11}$/.test(digits)) return 'diners';
  if (/^35\d{14}$/.test(digits)) return 'jcb';
  return undefined;
}
