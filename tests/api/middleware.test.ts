import { compose, withRequestId, withIdempotency } from '../../src/api/middleware';
import { IdempotencyStore } from '../../src/lib/idempotency';

function build(req: Partial<Parameters<typeof compose>[0][0]> = {}) {
  return {
    method: 'POST' as const,
    path: '/x', headers: {} as Record<string, string>, params: {}, query: {}, body: { a: 1 },
    ...req,
  };
}

describe('compose', () => {
  test('runs middlewares in order', async () => {
    const trail: string[] = [];
    const a = (req: any, next: any) => { trail.push('a-in'); return next(req).then((r: any) => { trail.push('a-out'); return r; }); };
    const b = (req: any, next: any) => { trail.push('b-in'); return next(req).then((r: any) => { trail.push('b-out'); return r; }); };
    const handler = async () => { trail.push('handler'); return { status: 200, body: {} }; };
    await compose([a, b])(handler)(build());
    expect(trail).toEqual(['a-in', 'b-in', 'handler', 'b-out', 'a-out']);
  });
});

describe('withRequestId', () => {
  test('uses incoming x-request-id if present', async () => {
    const mw = withRequestId(() => 'gen');
    const handler = async () => ({ status: 200, body: {} });
    const r = await compose([mw])(handler)(build({ headers: { 'x-request-id': 'caller' } }));
    expect(r.headers?.['x-request-id']).toBe('caller');
  });

  test('generates a new id otherwise', async () => {
    const mw = withRequestId(() => 'gen');
    const handler = async () => ({ status: 200, body: {} });
    const r = await compose([mw])(handler)(build());
    expect(r.headers?.['x-request-id']).toBe('gen');
  });
});

describe('withIdempotency', () => {
  test('caches successful responses by key', async () => {
    const store = new IdempotencyStore<{ id: string }>(60_000);
    const mw = withIdempotency(store);
    let calls = 0;
    const handler = async () => ({ status: 200, body: { id: 'x', call: calls++ } });
    const first = await compose([mw])(handler)(build({ headers: { 'idempotency-key': 'k' } }));
    const second = await compose([mw])(handler)(build({ headers: { 'idempotency-key': 'k' } }));
    expect(first.body).toEqual(second.body);
    expect(calls).toBe(1);
  });

  test('GETs bypass the cache', async () => {
    const store = new IdempotencyStore<{ id: string }>(60_000);
    const mw = withIdempotency(store);
    const handler = async () => ({ status: 200, body: { id: 'x' } });
    await compose([mw])(handler)({ ...build(), method: 'GET' });
    expect(store.size()).toBe(0);
  });
});
