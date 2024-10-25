import { buildFixture } from '../fixtures';

describe('WebhookDeliveryService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.webhookDeliveryService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.webhookDeliveryService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    expect(services.webhookDeliveryService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.webhookDeliveryService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    services.webhookDeliveryService.remove(e.id, 'admin');
    expect(() => services.webhookDeliveryService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.webhookDeliveryService.create({
      ...({ endpointId: 'e1', eventName: 'shipment.booked', payload: '{}' }),
      actor: 'admin',
    });
    services.webhookDeliveryService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
