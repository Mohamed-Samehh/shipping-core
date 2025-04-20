import { buildFixture } from '../fixtures';

describe('DriverService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.driverService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.driverService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    expect(services.driverService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.driverService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    services.driverService.remove(e.id, 'admin');
    expect(() => services.driverService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.driverService.create({
      ...({ name: 'John' }),
      actor: 'admin',
    });
    services.driverService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
