import { buildFixture } from '../fixtures';

describe('ProofOfDeliveryService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.proofOfDeliveryService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.proofOfDeliveryService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.proofOfDeliveryService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.proofOfDeliveryService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.proofOfDeliveryService.remove(e.id, 'admin');
    expect(() => services.proofOfDeliveryService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.proofOfDeliveryService.create({
      ...({ shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), deliveredAt: Date.now(), recordedAt: Date.now() }),
      actor: 'admin',
    });
    services.proofOfDeliveryService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
