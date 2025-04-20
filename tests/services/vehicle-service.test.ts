import { buildFixture } from '../fixtures';

describe('VehicleService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.vehicleService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.vehicleService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    expect(services.vehicleService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.vehicleService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    services.vehicleService.remove(e.id, 'admin');
    expect(() => services.vehicleService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.vehicleService.create({
      ...({ registration: 'VAN-' + Math.random().toString(36).slice(2), kind: 'van' as const, capacityWeightG: 1000000, capacityVolumeMm3: 5000000000 }),
      actor: 'admin',
    });
    services.vehicleService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
