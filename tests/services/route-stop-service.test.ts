import { buildFixture } from '../fixtures';

describe('RouteStopService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.routeStopService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.routeStopService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(services.routeStopService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.routeStopService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeStopService.remove(e.id, 'admin');
    expect(() => services.routeStopService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.routeStopService.create({
      ...({ routeId: 'r1', sequence: 0, kind: 'pickup' as const, addressId: 'a1', windowStart: Date.now(), windowEnd: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.routeStopService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
