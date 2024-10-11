// Harmonized System tariff code helpers. The customs declaration uses a 6-10
// digit HS code; we validate format and provide a description lookup for the
// small set of codes the integration tests pin against.

const RE_HS = /^\d{6,10}$/;

export interface HsCodeInfo {
  readonly code: string;
  readonly description: string;
  readonly chapter: string;
}

const TABLE: Record<string, HsCodeInfo> = {
  '610910': { code: '610910', description: 'T-shirts of cotton, knitted',         chapter: '61' },
  '420221': { code: '420221', description: 'Handbags with outer surface of leather', chapter: '42' },
  '640391': { code: '640391', description: 'Footwear with leather uppers',        chapter: '64' },
  '850440': { code: '850440', description: 'Static converters (e.g. power supplies)', chapter: '85' },
  '847130': { code: '847130', description: 'Portable digital computers',          chapter: '84' },
  '852872': { code: '852872', description: 'Colour reception apparatus for TV',   chapter: '85' },
  '300490': { code: '300490', description: 'Medicaments, other',                  chapter: '30' },
  '870323': { code: '870323', description: 'Motor cars, spark-ignition >1500cc', chapter: '87' },
};

export function isValidHsCode(value: string): boolean {
  return RE_HS.test(value);
}

export function describeHsCode(value: string): HsCodeInfo | undefined {
  if (!isValidHsCode(value)) return undefined;
  return TABLE[value];
}

export function chapter(value: string): string | undefined {
  if (!isValidHsCode(value)) return undefined;
  return value.slice(0, 2);
}

export function heading(value: string): string | undefined {
  if (!isValidHsCode(value)) return undefined;
  return value.slice(0, 4);
}

export function listKnown(): readonly HsCodeInfo[] {
  return Object.values(TABLE);
}
