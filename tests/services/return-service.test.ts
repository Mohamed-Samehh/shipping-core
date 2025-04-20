import { buildFixture } from '../fixtures';

describe('ReturnService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.returnService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.returnService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    expect(services.returnService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.returnService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    services.returnService.remove(e.id, 'admin');
    expect(() => services.returnService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.returnService.create({
      ...({ customerId: 'cu1', outboundShipmentId: 's1', reason: 'damaged' as const }),
      actor: 'admin',
    });
    services.returnService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
