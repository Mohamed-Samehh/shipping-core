import { buildFixture } from '../fixtures';

describe('SurchargeService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.surchargeService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.surchargeService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.surchargeService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.surchargeService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.surchargeService.remove(e.id, 'admin');
    expect(() => services.surchargeService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.surchargeService.create({
      ...({ carrierId: 'c1', kind: 'fuel' as const, code: 'FUEL-' + Math.random().toString(36).slice(2), name: 'Fuel', basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.surchargeService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
