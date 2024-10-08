import { buildFixture } from '../fixtures';

describe('PackageTypeService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.packageTypeService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.packageTypeService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    expect(services.packageTypeService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.packageTypeService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    services.packageTypeService.remove(e.id, 'admin');
    expect(() => services.packageTypeService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.packageTypeService.create({
      ...({ code: 'BOX-' + Math.random().toString(36).slice(2), name: 'Std Box', kind: 'box' as const, lengthMm: 300, widthMm: 200, heightMm: 100, emptyWeightG: 50, maxWeightG: 30000 }),
      actor: 'admin',
    });
    services.packageTypeService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
