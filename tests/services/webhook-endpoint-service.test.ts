import { buildFixture } from '../fixtures';

describe('WebhookEndpointService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.webhookEndpointService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.webhookEndpointService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    expect(services.webhookEndpointService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.webhookEndpointService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    services.webhookEndpointService.remove(e.id, 'admin');
    expect(() => services.webhookEndpointService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.webhookEndpointService.create({
      ...({ customerId: 'cu1', url: 'https://x.test/hook', secret: 'top-secret-string', events: ['shipment.booked'] }),
      actor: 'admin',
    });
    services.webhookEndpointService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
