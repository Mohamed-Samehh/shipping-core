import { buildFixture } from '../fixtures';

describe('RateService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.rateService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.rateService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(services.rateService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.rateService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateService.remove(e.id, 'admin');
    expect(() => services.rateService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.rateService.create({
      ...({ shipmentId: 's1', carrierId: 'c1', serviceId: 'sv1', amount: 1099n, currency: 'USD', baseAmount: 1099n, estimatedTransitDays: 3, expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
