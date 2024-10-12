// Defensive JSON helpers used at API boundaries -- never throw raw, always
// produce a typed Result that the caller can switch on.

import { Result, err, ok } from './result';

export function safeJsonParse(value: string): Result<unknown, Error> {
  try { return ok(JSON.parse(value)); }
  catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

export function safeJsonStringify(value: unknown, space = 0): Result<string, Error> {
  try { return ok(JSON.stringify(value, undefined, space)); }
  catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

export function pretty(value: unknown): string {
  const r = safeJsonStringify(value, 2);
  return r.ok ? r.value : `<unserialisable: ${r.error.message}>`;
}

export function omit<T extends Record<string, unknown>>(value: T, keys: readonly string[]): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (!keys.includes(k)) out[k] = v;
  }
  return out as Partial<T>;
}

export function pick<T extends Record<string, unknown>>(value: T, keys: readonly string[]): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(value, key)) out[key] = value[key];
  }
  return out as Partial<T>;
}
