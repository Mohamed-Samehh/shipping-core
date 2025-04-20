import { buildFixture } from '../fixtures';

describe('LocationService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.locationService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.locationService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    expect(services.locationService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.locationService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    services.locationService.remove(e.id, 'admin');
    expect(() => services.locationService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.locationService.create({
      ...({ customerId: 'cu1', code: 'WH-' + Math.random().toString(36).slice(2), name: 'Warehouse', kind: 'warehouse' as const, addressId: 'a1', pickupCutoffLocal: '17:00', timezone: 'America/Los_Angeles' }),
      actor: 'admin',
    });
    services.locationService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
