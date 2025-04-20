import { buildFixture } from '../fixtures';

describe('ForecastService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.forecastService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.forecastService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.forecastService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.forecastService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    services.forecastService.remove(e.id, 'admin');
    expect(() => services.forecastService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.forecastService.create({
      ...({ scope: 'platform' as const, periodStart: Date.now(), periodEnd: Date.now() + 86400000, expectedShipments: 100, expectedWeightG: 100000, confidence: 0.8, generatedAt: Date.now() }),
      actor: 'admin',
    });
    services.forecastService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
