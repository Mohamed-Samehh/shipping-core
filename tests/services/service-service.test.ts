import { buildFixture } from '../fixtures';

describe('ServiceService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.serviceService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.serviceService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    expect(services.serviceService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.serviceService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    services.serviceService.remove(e.id, 'admin');
    expect(() => services.serviceService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.serviceService.create({
      ...({ carrierId: 'c1', code: 'GROUND-' + Math.random().toString(36).slice(2), name: 'Ground', category: 'ground' as const, transitDaysMin: 1, transitDaysMax: 5 }),
      actor: 'admin',
    });
    services.serviceService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
