import { buildFixture } from '../fixtures';

describe('NotificationService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.notificationService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.notificationService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    expect(services.notificationService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.notificationService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    services.notificationService.remove(e.id, 'admin');
    expect(() => services.notificationService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.notificationService.create({
      ...({ customerId: 'cu1', channel: 'email' as const, template: 'shipment_booked', recipient: 'a@b.com' }),
      actor: 'admin',
    });
    services.notificationService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
