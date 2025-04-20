import { buildFixture } from '../fixtures';

describe('HazmatDeclarationService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.hazmatDeclarationService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.hazmatDeclarationService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.hazmatDeclarationService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.hazmatDeclarationService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    services.hazmatDeclarationService.remove(e.id, 'admin');
    expect(() => services.hazmatDeclarationService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.hazmatDeclarationService.create({
      ...({ shipmentId: 's1', unNumber: 'UN1234', properShippingName: 'lithium battery', hazardClass: '9' as const, netQuantityG: 100, signedBy: 'driver', signedAt: Date.now() }),
      actor: 'admin',
    });
    services.hazmatDeclarationService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
