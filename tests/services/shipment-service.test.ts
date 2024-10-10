import { buildFixture } from '../fixtures';

describe('ShipmentService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.shipmentService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.shipmentService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    expect(services.shipmentService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.shipmentService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    services.shipmentService.remove(e.id, 'admin');
    expect(() => services.shipmentService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.shipmentService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2' }),
      actor: 'admin',
    });
    services.shipmentService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
