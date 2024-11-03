import { buildFixture } from '../fixtures';

describe('DispatchSlotService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.dispatchSlotService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.dispatchSlotService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    expect(services.dispatchSlotService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.dispatchSlotService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    services.dispatchSlotService.remove(e.id, 'admin');
    expect(() => services.dispatchSlotService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.dispatchSlotService.create({
      ...({ carrierId: 'c1', locationId: 'l1', windowStart: Date.now(), windowEnd: Date.now() + 3600000, capacity: 100 }),
      actor: 'admin',
    });
    services.dispatchSlotService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
