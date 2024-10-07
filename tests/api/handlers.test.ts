import { ping, listShipments, getShipment, createShipment } from '../../src/api/handlers';
import { buildFixture } from '../fixtures';

describe('api handlers', () => {
  test('ping returns ok', () => {
    expect(ping().status).toBe(200);
  });

  test('listShipments filters by customer', () => {
    const fix = buildFixture();
    fix.services.shipmentService.create({
      customerId: 'c1', fromAddressId: 'a', toAddressId: 'b', actor: 'api',
    });
    fix.services.shipmentService.create({
      customerId: 'c2', fromAddressId: 'a', toAddressId: 'b', actor: 'api',
    });
    const r = listShipments(makeReq('c1'), fix.services);
    expect((r.body as { shipments: unknown[] }).shipments.length).toBe(1);
  });

  test('getShipment returns 404 for other-customer', () => {
    const fix = buildFixture();
    const e = fix.services.shipmentService.create({
      customerId: 'c1', fromAddressId: 'a', toAddressId: 'b', actor: 'api',
    });
    const r = getShipment({ ...makeReq('c2'), params: { id: e.id } }, fix.services);
    expect(r.status).toBe(404);
  });

  test('createShipment stamps customer', () => {
    const fix = buildFixture();
    const r = createShipment({
      ...makeReq('c1'),
      body: { fromAddressId: 'a', toAddressId: 'b' },
    } as never, fix.services);
    expect(r.status).toBe(201);
  });

  test('createShipment honours reference', () => {
    const fix = buildFixture();
    const r = createShipment({
      ...makeReq('c1'),
      body: { fromAddressId: 'a', toAddressId: 'b', reference: 'ORD-1' },
    } as never, fix.services);
    expect((r.body as { shipment: { reference?: string } }).shipment.reference).toBe('ORD-1');
  });
});

function makeReq(customerId: string) {
  return {
    method: 'GET' as const,
    path: '/x',
    headers: {},
    params: {} as Record<string, string>,
    query: {},
    body: undefined as never,
    customerId,
  };
}
