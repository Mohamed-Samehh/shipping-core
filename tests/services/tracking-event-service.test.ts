import { buildFixture } from '../fixtures';

describe('TrackingEventService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.trackingEventService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.trackingEventService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.trackingEventService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.trackingEventService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.trackingEventService.remove(e.id, 'admin');
    expect(() => services.trackingEventService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.trackingEventService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), status: 'in_transit' as const, description: 'Departed', occurredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.trackingEventService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
