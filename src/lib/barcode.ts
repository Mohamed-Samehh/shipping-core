// SSCC-18 / GS1 barcode generation. The label service renders tracking
// numbers as SSCC, and the manifest's UCC pallet barcode follows the same
// scheme; both validate via mod10 check digit.

export function ssccCheckDigit(payload: string): number {
  if (!/^\d{17}$/.test(payload)) throw new RangeError('SSCC payload must be 17 digits');
  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    const digit = Number(payload[i] as string);
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

export function buildSscc(extension: number, gs1Prefix: string, serial: number): string {
  if (!Number.isInteger(extension) || extension < 0 || extension > 9) {
    throw new RangeError('extension digit must be 0..9');
  }
  if (!/^\d{7,10}$/.test(gs1Prefix)) throw new RangeError('gs1Prefix must be 7-10 digits');
  if (!Number.isInteger(serial) || serial < 0) throw new RangeError('serial must be a non-neg int');
  const serialStr = serial.toString().padStart(16 - gs1Prefix.length, '0');
  const payload = `${extension}${gs1Prefix}${serialStr}`;
  return `${payload}${ssccCheckDigit(payload)}`;
}

export function isValidSscc(value: string): boolean {
  if (!/^\d{18}$/.test(value)) return false;
  const payload = value.slice(0, 17);
  const check = Number(value[17] as string);
  return ssccCheckDigit(payload) === check;
}

export function formatBarcode(value: string): string {
  return value.replace(/(.{4})/g, '$1 ').trim();
}
