// In-memory counters / gauges / histograms used as a no-op default for the
// metrics interface every service depends on.

export interface MetricSnapshot {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, { count: number; sum: number; p50: number; p95: number; p99: number }>;
}

export interface Metrics {
  inc(name: string, value?: number, tags?: Record<string, string>): void;
  gauge(name: string, value: number, tags?: Record<string, string>): void;
  observe(name: string, value: number, tags?: Record<string, string>): void;
  snapshot(): MetricSnapshot;
}

export class InMemoryMetrics implements Metrics {
  private readonly counters = new Map<string, number>();
  private readonly gauges = new Map<string, number>();
  private readonly samples = new Map<string, number[]>();

  inc(name: string, value = 1): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + value);
  }

  gauge(name: string, value: number): void {
    this.gauges.set(name, value);
  }

  observe(name: string, value: number): void {
    let arr = this.samples.get(name);
    if (!arr) { arr = []; this.samples.set(name, arr); }
    arr.push(value);
  }

  snapshot(): MetricSnapshot {
    const histograms: MetricSnapshot['histograms'] = {};
    for (const [name, values] of this.samples) {
      if (values.length === 0) continue;
      const sorted = values.slice().sort((a, b) => a - b);
      histograms[name] = {
        count: sorted.length,
        sum: sorted.reduce((acc, v) => acc + v, 0),
        p50: percentile(sorted, 0.5),
        p95: percentile(sorted, 0.95),
        p99: percentile(sorted, 0.99),
      };
    }
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms,
    };
  }

  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.samples.clear();
  }
}

function percentile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[idx] as number;
}
