// Bigint-backed fixed-point decimal. Used by `money` for cross-currency
// arithmetic that would otherwise lose pennies in float math.

export interface Decimal {
  readonly value: bigint;
  readonly scale: number;
}

export function decimal(value: number | bigint | string, scale = 4): Decimal {
  if (!Number.isInteger(scale) || scale < 0) throw new RangeError('scale must be a non-neg int');
  const factor = 10n ** BigInt(scale);
  if (typeof value === 'bigint') {
    return { value: value * factor, scale };
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new RangeError('value must be finite');
    return { value: BigInt(Math.round(value * Number(factor))), scale };
  }
  const trimmed = value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) throw new RangeError(`bad decimal: ${value}`);
  const neg = trimmed.startsWith('-');
  const body = neg ? trimmed.slice(1) : trimmed;
  const [whole, frac = ''] = body.split('.', 2);
  const fracPadded = (frac + '0'.repeat(scale)).slice(0, scale);
  const mag = scale === 0 ? BigInt(whole ?? '0') : BigInt(whole ?? '0') * factor + BigInt(fracPadded || '0');
  return { value: neg ? -mag : mag, scale };
}

export function rescale(d: Decimal, newScale: number, mode: 'half-even' | 'down' = 'half-even'): Decimal {
  if (newScale === d.scale) return d;
  if (newScale > d.scale) {
    return { value: d.value * 10n ** BigInt(newScale - d.scale), scale: newScale };
  }
  const drop = BigInt(d.scale - newScale);
  const divisor = 10n ** drop;
  if (mode === 'down') return { value: d.value / divisor, scale: newScale };
  const quotient = d.value / divisor;
  const remainder = d.value - quotient * divisor;
  const half = divisor / 2n;
  if (remainder > half || (remainder === half && quotient % 2n !== 0n)) {
    return { value: quotient + 1n, scale: newScale };
  }
  if (remainder < -half || (remainder === -half && quotient % 2n !== 0n)) {
    return { value: quotient - 1n, scale: newScale };
  }
  return { value: quotient, scale: newScale };
}

export function dadd(a: Decimal, b: Decimal): Decimal {
  const s = Math.max(a.scale, b.scale);
  return { value: rescale(a, s).value + rescale(b, s).value, scale: s };
}

export function dsub(a: Decimal, b: Decimal): Decimal {
  const s = Math.max(a.scale, b.scale);
  return { value: rescale(a, s).value - rescale(b, s).value, scale: s };
}

export function dmul(a: Decimal, b: Decimal): Decimal {
  const factor = 10n ** BigInt(b.scale);
  return { value: (a.value * b.value) / factor, scale: a.scale };
}

export function ddiv(a: Decimal, b: Decimal, scale = a.scale): Decimal {
  if (b.value === 0n) throw new RangeError('division by zero');
  const factor = 10n ** BigInt(scale);
  return { value: (a.value * factor * 10n ** BigInt(b.scale)) / (b.value * 10n ** BigInt(a.scale)), scale };
}

export function decimalToString(d: Decimal): string {
  const neg = d.value < 0n;
  const abs = neg ? -d.value : d.value;
  const factor = 10n ** BigInt(d.scale);
  const whole = abs / factor;
  const frac = (abs % factor).toString().padStart(d.scale, '0');
  const sign = neg ? '-' : '';
  return d.scale === 0 ? `${sign}${whole}` : `${sign}${whole}.${frac}`;
}
