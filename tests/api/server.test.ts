import { createServer } from '../../src/api/server';
import { buildFixture } from '../fixtures';

describe('createServer', () => {
  test('ping route is wired', async () => {
    const fixture = buildFixture();
    const router = createServer({ fixture });
    const r = await router.dispatch({
      method: 'GET', path: '/v1/ping', headers: {}, params: {}, query: {}, body: undefined,
    });
    expect(r.status).toBe(200);
  });

  test('listing shipments requires auth', async () => {
    const fixture = buildFixture();
    const router = createServer({ fixture, apiKeys: { 'k': { customerId: 'c1' } } });
    const noKey = await router.dispatch({
      method: 'GET', path: '/v1/shipments', headers: {}, params: {}, query: {}, body: undefined,
    });
    expect(noKey.status).toBe(401);
  });

  test('listing shipments with auth returns ok', async () => {
    const fixture = buildFixture();
    fixture.services.shipmentService.create({
      customerId: 'c1', fromAddressId: 'a', toAddressId: 'b', actor: 'api',
    });
    const router = createServer({ fixture, apiKeys: { 'k': { customerId: 'c1' } } });
    const r = await router.dispatch({
      method: 'GET', path: '/v1/shipments', headers: { 'x-helix-api-key': 'k' },
      params: {}, query: {}, body: undefined,
    });
    expect(r.status).toBe(200);
  });

  test('creating shipment returns 201', async () => {
    const fixture = buildFixture();
    const router = createServer({ fixture, apiKeys: { 'k': { customerId: 'c1' } } });
    const r = await router.dispatch({
      method: 'POST', path: '/v1/shipments', headers: { 'x-helix-api-key': 'k' },
      params: {}, query: {}, body: { fromAddressId: 'a', toAddressId: 'b' } as never,
    });
    expect(r.status).toBe(201);
  });
});
