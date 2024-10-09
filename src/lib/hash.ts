// Small, dependency-free hashing helpers used for fingerprinting cache keys,
// idempotency tokens and audit-event signatures. `sha256Hex` defers to Node's
// built-in `crypto` so we don't bundle a pure-JS implementation in production.

import { createHash } from 'crypto';

export function fnv1a32(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function fnv1aHex(value: string): string {
  return fnv1a32(value).toString(16).padStart(8, '0');
}

export function sha256Hex(value: string | Buffer): string {
  const hasher = createHash('sha256');
  hasher.update(value);
  return hasher.digest('hex');
}

export function shortFingerprint(value: string, length = 12): string {
  if (length < 4 || length > 32) {
    throw new RangeError('fingerprint length must be in [4, 32]');
  }
  return sha256Hex(value).slice(0, length);
}

export function canonicalJSON(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJSON(obj[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function fingerprintObject(value: unknown, length = 12): string {
  return shortFingerprint(canonicalJSON(value), length);
}
