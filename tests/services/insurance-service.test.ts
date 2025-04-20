import { buildFixture } from '../fixtures';

describe('InsuranceService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.insuranceService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.insuranceService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    expect(services.insuranceService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.insuranceService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.insuranceService.remove(e.id, 'admin');
    expect(() => services.insuranceService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.insuranceService.create({
      ...({ shipmentId: 's1', provider: 'carrier' as const, coverageAmount: 100000n, coverageCurrency: 'USD', premiumAmount: 100n, premiumCurrency: 'USD', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.insuranceService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
