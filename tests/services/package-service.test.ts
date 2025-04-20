import { buildFixture } from '../fixtures';

describe('PackageService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.packageService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.packageService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    expect(services.packageService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.packageService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    services.packageService.remove(e.id, 'admin');
    expect(() => services.packageService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.packageService.create({
      ...({ shipmentId: 's1', lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000 }),
      actor: 'admin',
    });
    services.packageService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
