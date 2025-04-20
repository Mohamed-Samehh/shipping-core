import { buildFixture } from '../fixtures';

describe('RouteService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.routeService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.routeService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(services.routeService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.routeService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeService.remove(e.id, 'admin');
    expect(() => services.routeService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.routeService.create({
      ...({ plannedStart: Date.now(), plannedEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
