import { Router } from '../../src/api/router';
import { ShippingError } from '../../src/errors';

class TestNotFound extends ShippingError {}

describe('Router', () => {
  test('dispatches GET by path', async () => {
    const router = new Router();
    router.get('/hi', () => ({ status: 200, body: { ok: true } }));
    const r = await router.dispatch({ method: 'GET', path: '/hi', headers: {}, params: {}, query: {}, body: undefined });
    expect(r.status).toBe(200);
  });

  test('extracts path params', async () => {
    const router = new Router();
    router.get('/shipments/:id', (req) => ({ status: 200, body: req.params }));
    const r = await router.dispatch({ method: 'GET', path: '/shipments/abc', headers: {}, params: {}, query: {}, body: undefined });
    expect((r.body as { id: string }).id).toBe('abc');
  });

  test('404 on unknown route', async () => {
    const router = new Router();
    const r = await router.dispatch({ method: 'GET', path: '/x', headers: {}, params: {}, query: {}, body: undefined });
    expect(r.status).toBe(404);
  });

  test('maps ShippingError to status', async () => {
    const router = new Router();
    router.get('/bad', () => { throw new TestNotFound('SHIPMENT_NOT_FOUND', 'gone'); });
    const r = await router.dispatch({ method: 'GET', path: '/bad', headers: {}, params: {}, query: {}, body: undefined });
    expect(r.status).toBe(404);
  });

  test('500 on unknown errors', async () => {
    const router = new Router();
    router.get('/boom', () => { throw new Error('boom'); });
    const r = await router.dispatch({ method: 'GET', path: '/boom', headers: {}, params: {}, query: {}, body: undefined });
    expect(r.status).toBe(500);
  });

  test('supports POST / PUT / PATCH / DELETE', async () => {
    const router = new Router();
    router.post('/x', () => ({ status: 201, body: {} }));
    router.put('/x', () => ({ status: 200, body: {} }));
    router.patch('/x', () => ({ status: 200, body: {} }));
    router.delete('/x', () => ({ status: 204, body: {} }));
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
      const r = await router.dispatch({ method, path: '/x', headers: {}, params: {}, query: {}, body: undefined });
      expect(r.status >= 200 && r.status < 300).toBe(true);
    }
  });
});
