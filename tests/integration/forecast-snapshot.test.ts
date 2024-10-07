import { buildFixture } from '../fixtures';

describe('forecast snapshot', () => {
  test('latest snapshot by scope wins', () => {
    const { services } = buildFixture();
    services.forecastService.create({
      scope: 'platform',
      periodStart: 0, periodEnd: 86_400_000,
      expectedShipments: 100, expectedWeightG: 500_000,
      confidence: 0.7,
      generatedAt: 1_000, actor: 'cron',
    });
    services.forecastService.create({
      scope: 'platform',
      periodStart: 0, periodEnd: 86_400_000,
      expectedShipments: 120, expectedWeightG: 600_000,
      confidence: 0.8,
      generatedAt: 2_000, actor: 'cron',
    });
    const platform = services.forecastService.list().filter((f) => f.scope === 'platform');
    const latest = platform.reduce((best, f) => (f.generatedAt > best.generatedAt ? f : best),
      platform[0]!);
    expect(latest.expectedShipments).toBe(120);
  });
});
