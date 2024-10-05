import { InMemoryMetrics } from '../../src/lib/metrics';

describe('InMemoryMetrics', () => {
  test('inc accumulates', () => {
    const m = new InMemoryMetrics();
    m.inc('a'); m.inc('a', 4);
    expect(m.snapshot().counters.a).toBe(5);
  });

  test('gauge overwrites', () => {
    const m = new InMemoryMetrics();
    m.gauge('q', 1); m.gauge('q', 7);
    expect(m.snapshot().gauges.q).toBe(7);
  });

  test('observe computes percentiles', () => {
    const m = new InMemoryMetrics();
    for (let i = 1; i <= 100; i++) m.observe('lat', i);
    const h = m.snapshot().histograms.lat;
    expect(h!.count).toBe(100);
    expect(h!.p50).toBe(51);
    expect(h!.p95).toBe(96);
  });

  test('reset clears all state', () => {
    const m = new InMemoryMetrics();
    m.inc('a');
    m.reset();
    expect(m.snapshot().counters).toEqual({});
  });
});
