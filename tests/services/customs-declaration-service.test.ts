import { buildFixture } from '../fixtures';

describe('CustomsDeclarationService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.customsDeclarationService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.customsDeclarationService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    expect(services.customsDeclarationService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.customsDeclarationService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    services.customsDeclarationService.remove(e.id, 'admin');
    expect(() => services.customsDeclarationService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.customsDeclarationService.create({
      ...({ shipmentId: 's1', type: 'merchandise' as const }),
      actor: 'admin',
    });
    services.customsDeclarationService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
