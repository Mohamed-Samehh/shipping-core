// Typed env-var loader. Reads optional + required string / int / bool keys
// from process.env (or any record) and throws a single aggregated error if
// required fields are missing.

import { ValidationError } from '../errors';

export interface EnvSource {
  readonly env: Record<string, string | undefined>;
}

export function readString(source: EnvSource, key: string, fallback?: string): string {
  const value = source.env[key];
  if (value === undefined || value === '') {
    if (fallback === undefined) {
      throw new ValidationError('ENV_MISSING', `env var ${key} is required`, { key });
    }
    return fallback;
  }
  return value;
}

export function readInt(source: EnvSource, key: string, fallback?: number): number {
  const raw = source.env[key];
  if (raw === undefined || raw === '') {
    if (fallback === undefined) {
      throw new ValidationError('ENV_MISSING', `env var ${key} is required`, { key });
    }
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || raw.trim() !== String(parsed)) {
    throw new ValidationError('ENV_BAD_INT', `env var ${key} is not an integer`, { key, raw });
  }
  return parsed;
}

export function readBool(source: EnvSource, key: string, fallback?: boolean): boolean {
  const raw = source.env[key];
  if (raw === undefined || raw === '') {
    if (fallback === undefined) {
      throw new ValidationError('ENV_MISSING', `env var ${key} is required`, { key });
    }
    return fallback;
  }
  const v = raw.trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
  throw new ValidationError('ENV_BAD_BOOL', `env var ${key} is not a boolean`, { key, raw });
}

export function readEnum<T extends string>(source: EnvSource, key: string,
  allowed: readonly T[], fallback?: T): T {
  const raw = source.env[key];
  if (raw === undefined || raw === '') {
    if (fallback === undefined) {
      throw new ValidationError('ENV_MISSING', `env var ${key} is required`, { key });
    }
    return fallback;
  }
  if (!(allowed as readonly string[]).includes(raw)) {
    throw new ValidationError('ENV_BAD_ENUM', `env var ${key} must be one of ${allowed.join(', ')}`, {
      key, raw, allowed,
    });
  }
  return raw as T;
}
