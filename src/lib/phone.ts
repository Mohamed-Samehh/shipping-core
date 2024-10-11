// Phone helpers. Storage form is always E.164 (+ then digits); the
// `formatNational` helper is only for display.

const RE_E164 = /^\+[1-9]\d{1,14}$/;

export function normalisePhone(value: string): string {
  const digits = value.replace(/[\s().-]+/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  return '+' + digits.replace(/\D/g, '');
}

export function isE164(value: string): boolean {
  return RE_E164.test(value);
}

export function countryCode(value: string): string | undefined {
  if (!value.startsWith('+')) return undefined;
  const digits = value.slice(1);
  if (digits.length === 0) return undefined;
  for (const length of [1, 2, 3]) {
    if (digits.length >= length) return digits.slice(0, length);
  }
  return undefined;
}

export function maskPhone(value: string, visible = 4): string {
  if (!value) return value;
  const head = value.startsWith('+') ? '+' : '';
  const digits = value.replace(/\D/g, '');
  if (digits.length <= visible) return head + digits;
  return head + '*'.repeat(digits.length - visible) + digits.slice(-visible);
}

export function formatNational(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    const rest = digits.slice(1);
    return `(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  }
  return value;
}
