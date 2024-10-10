import { buildFixture } from '../fixtures';

describe('rate shopping', () => {
  test('captures rates and lets the caller pick cheapest', () => {
    const { services } = buildFixture();
    const expires = Date.now() + 3_600_000;

    services.rateService.create({
      shipmentId: 's1', carrierId: 'c1', serviceId: 'sv-ground',
      amount: 1099n, currency: 'USD', baseAmount: 1099n,
      estimatedTransitDays: 5, expiresAt: expires, actor: 'rates',
    });

    services.rateService.create({
      shipmentId: 's1', carrierId: 'c2', serviceId: 'sv-express',
      amount: 2499n, currency: 'USD', baseAmount: 2499n,
      estimatedTransitDays: 1, expiresAt: expires, actor: 'rates',
    });

    const rates = services.rateService.list().filter((r) => r.shipmentId === 's1');
    const cheapest = rates.reduce((best, r) => (r.amount < best.amount ? r : best), rates[0]!);
    expect(cheapest.serviceId).toBe('sv-ground');
  });
});
