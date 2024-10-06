// Carrier-style zone lookup. Maps a (origin postal-prefix, destination
// postal-prefix) pair onto a small integer 1..9, the way major US carriers
// publish their rate cards.

const TABLE: Record<string, Record<string, number>> = {
  '94': { '94': 1, '95': 2, '96': 2, '97': 3, '90': 2, '20': 7, '10': 8, '00': 9 },
  '95': { '94': 2, '95': 1, '96': 2, '97': 3, '90': 2, '20': 7, '10': 8, '00': 9 },
  '90': { '94': 2, '95': 2, '90': 1, '92': 1, '20': 6, '10': 7, '00': 8 },
  '10': { '10': 1, '11': 2, '07': 2, '02': 3, '20': 4, '94': 8, '00': 9 },
  '20': { '20': 1, '22': 1, '23': 2, '10': 4, '94': 7, '00': 9 },
  '60': { '60': 1, '61': 2, '53': 3, '94': 6, '10': 5, '00': 8 },
  '02': { '02': 1, '03': 2, '04': 2, '10': 3, '94': 8, '00': 9 },
};

export function zoneLookup(originPostal: string, destinationPostal: string): number {
  const op = postalPrefix(originPostal);
  const dp = postalPrefix(destinationPostal);
  return TABLE[op]?.[dp] ?? defaultZone(op, dp);
}

function postalPrefix(value: string): string {
  return value.replace(/\D/g, '').slice(0, 2) || '00';
}

function defaultZone(op: string, dp: string): number {
  if (op === dp) return 2;
  const diff = Math.abs(Number(op) - Number(dp));
  if (diff <= 5) return 3;
  if (diff <= 15) return 5;
  if (diff <= 30) return 6;
  return 8;
}

export function isLocalZone(zone: number): boolean {
  return zone === 1 || zone === 2;
}

export function isLongHaulZone(zone: number): boolean {
  return zone >= 7;
}
