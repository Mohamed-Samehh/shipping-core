// Client-supplied idempotency keys. The service stores a fingerprint of the
// request body alongside the response; replaying the same key returns the same
// response without re-running the side effect.

import { IdempotencyConflictError } from '../errors';
import { fingerprintObject } from './hash';

export interface IdempotencyRecord<T> {
  readonly key: string;
  readonly fingerprint: string;
  readonly response: T;
  readonly createdAt: number;
}

export class IdempotencyStore<T> {
  private readonly records = new Map<string, IdempotencyRecord<T>>();

  constructor(private readonly ttlMs: number, private readonly now: () => number = Date.now) {
    if (ttlMs <= 0) throw new RangeError('ttlMs must be positive');
  }

  remember(key: string, body: unknown, response: T): IdempotencyRecord<T> {
    const fingerprint = fingerprintObject(body);
    const existing = this.records.get(key);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new IdempotencyConflictError('IDEMPOTENCY_MISMATCH',
          `key ${key} was previously used with a different request body`,
          { key, fingerprint });
      }
      return existing;
    }
    const record: IdempotencyRecord<T> = {
      key, fingerprint, response, createdAt: this.now(),
    };
    this.records.set(key, record);
    return record;
  }

  lookup(key: string, body: unknown): IdempotencyRecord<T> | undefined {
    const record = this.records.get(key);
    if (!record) return undefined;
    if (this.now() - record.createdAt > this.ttlMs) {
      this.records.delete(key);
      return undefined;
    }
    const fingerprint = fingerprintObject(body);
    if (record.fingerprint !== fingerprint) {
      throw new IdempotencyConflictError('IDEMPOTENCY_MISMATCH',
        `key ${key} was previously used with a different request body`,
        { key, fingerprint });
    }
    return record;
  }

  clear(): void { this.records.clear(); }
  size(): number { return this.records.size; }
}
