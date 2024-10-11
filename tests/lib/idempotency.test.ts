import { IdempotencyStore } from '../../src/lib/idempotency';
import { IdempotencyConflictError } from '../../src/errors';

describe('IdempotencyStore', () => {
  test('remember returns same record for same body', () => {
    const s = new IdempotencyStore<{ id: string }>(60_000);
    const r = s.remember('k1', { a: 1 }, { id: 'x' });
    const r2 = s.lookup('k1', { a: 1 });
    expect(r2?.response.id).toBe('x');
    expect(r2?.key).toBe(r.key);
  });

  test('mismatching body throws conflict', () => {
    const s = new IdempotencyStore<{ id: string }>(60_000);
    s.remember('k1', { a: 1 }, { id: 'x' });
    expect(() => s.lookup('k1', { a: 2 })).toThrow(IdempotencyConflictError);
  });

  test('expired records vanish from lookup', () => {
    let now = 0;
    const s = new IdempotencyStore<{ id: string }>(1000, () => now);
    s.remember('k', { a: 1 }, { id: 'x' });
    now += 2000;
    expect(s.lookup('k', { a: 1 })).toBeUndefined();
  });

  test('rejects zero ttl', () => {
    expect(() => new IdempotencyStore(0)).toThrow();
  });
});
