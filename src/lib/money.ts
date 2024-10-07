// Money is an immutable (amount, currency) pair. amount is in the currency's
// minor units (cents, yen, etc.) as a bigint. Arithmetic stays exact, with no
// floating-point pennies.

import { CurrencyMismatchError } from '../errors';
import { currencyInfo } from './currency';

export interface Money {
  readonly amount: bigint;
  readonly currency: string;
}

export function money(amount: number | bigint | string, currency: string): Money {
  const info = currencyInfo(currency);
  const factor = 10n ** BigInt(info.minorUnits);
  let value: bigint;
  if (typeof amount === 'bigint') {
    value = amount;
  } else if (typeof amount === 'number') {
    if (!Number.isFinite(amount)) throw new RangeError('amount must be finite');
    value = BigInt(Math.round(amount * Number(factor)));
  } else {
    const trimmed = amount.trim();
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) throw new RangeError(`invalid money string: ${amount}`);
    const negative = trimmed.startsWith('-');
    const body = negative ? trimmed.slice(1) : trimmed;
    const [whole, frac = ''] = body.split('.', 2);
    const wholeBigInt = BigInt(whole ?? '0');
    const fracPadded = (frac + '0'.repeat(info.minorUnits)).slice(0, info.minorUnits);
    const fracBigInt = BigInt(fracPadded || '0');
    const magnitude = info.minorUnits === 0 ? wholeBigInt : wholeBigInt * factor + fracBigInt;
    value = negative ? -magnitude : magnitude;
  }
  return { amount: value, currency: info.code };
}

export function zero(currency: string): Money {
  return { amount: 0n, currency: currencyInfo(currency).code };
}

export function plus(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function minus(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { amount: a.amount - b.amount, currency: a.currency };
}

export function times(value: Money, factor: number | bigint): Money {
  if (typeof factor === 'bigint') return { amount: value.amount * factor, currency: value.currency };
  if (!Number.isFinite(factor)) throw new RangeError('factor must be finite');
  if (Number.isInteger(factor)) return { amount: value.amount * BigInt(factor), currency: value.currency };
  const SCALE = 1_000_000_000;
  return {
    amount: (value.amount * BigInt(Math.round(factor * SCALE))) / BigInt(SCALE),
    currency: value.currency,
  };
}

export function negate(value: Money): Money {
  return { amount: -value.amount, currency: value.currency };
}

export function abs(value: Money): Money {
  return { amount: value.amount < 0n ? -value.amount : value.amount, currency: value.currency };
}

export function compare(a: Money, b: Money): number {
  assertSameCurrency(a, b);
  if (a.amount < b.amount) return -1;
  if (a.amount > b.amount) return 1;
  return 0;
}

export function equal(a: Money, b: Money): boolean {
  return a.currency === b.currency && a.amount === b.amount;
}

export function isPositive(value: Money): boolean { return value.amount > 0n; }
export function isNegative(value: Money): boolean { return value.amount < 0n; }
export function isZero(value: Money): boolean { return value.amount === 0n; }

export function sum(values: readonly Money[], currency?: string): Money {
  if (values.length === 0) {
    if (!currency) throw new TypeError('sum() of an empty array requires a currency hint');
    return zero(currency);
  }
  let total = values[0]!;
  for (let i = 1; i < values.length; i++) total = plus(total, values[i] as Money);
  return total;
}

export function format(value: Money, options: { withSymbol?: boolean } = {}): string {
  const info = currencyInfo(value.currency);
  const factor = 10n ** BigInt(info.minorUnits);
  const negative = value.amount < 0n;
  const absolute = negative ? -value.amount : value.amount;
  const whole = absolute / factor;
  const frac = (absolute % factor).toString().padStart(info.minorUnits, '0');
  const sign = negative ? '-' : '';
  const body = info.minorUnits === 0 ? `${sign}${whole}` : `${sign}${whole}.${frac}`;
  return options.withSymbol ? `${info.symbol}${body}` : body;
}

export function allocate(value: Money, parts: number): Money[] {
  if (!Number.isInteger(parts) || parts < 1) throw new RangeError('parts must be a positive integer');
  const partsBig = BigInt(parts);
  const base = value.amount / partsBig;
  const remainder = value.amount - base * partsBig;
  const out: Money[] = [];
  for (let i = 0; i < parts; i++) {
    const extra = BigInt(i) < (remainder < 0n ? -remainder : remainder) ? 1n : 0n;
    const signed = remainder < 0n ? -extra : extra;
    out.push({ amount: base + signed, currency: value.currency });
  }
  return out;
}

export function allocateWeighted(value: Money, weights: readonly number[]): Money[] {
  if (weights.length === 0) throw new RangeError('weights must be non-empty');
  for (const w of weights) {
    if (!Number.isInteger(w) || w < 0) throw new RangeError('weights must be non-neg integers');
  }
  const total = weights.reduce((acc, w) => acc + w, 0);
  if (total === 0) throw new RangeError('weights must sum to positive total');
  const totalBig = BigInt(total);
  const out: Money[] = [];
  let allocated = 0n;
  for (let i = 0; i < weights.length - 1; i++) {
    const share = (value.amount * BigInt(weights[i] as number)) / totalBig;
    out.push({ amount: share, currency: value.currency });
    allocated += share;
  }
  out.push({ amount: value.amount - allocated, currency: value.currency });
  return out;
}

export function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new CurrencyMismatchError('CURRENCY_MISMATCH',
      `currencies differ: ${a.currency} vs ${b.currency}`,
      { left: a.currency, right: b.currency });
  }
}
