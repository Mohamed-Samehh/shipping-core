// Aggregate health for the service mesh. Each check returns ok/degraded/fail
// and a structured note; the aggregator reports the worst.

export type HealthStatus = 'ok' | 'degraded' | 'fail';

export interface HealthResult {
  readonly status: HealthStatus;
  readonly note?: string;
}

export interface HealthCheck {
  readonly name: string;
  run(): Promise<HealthResult>;
}

export interface AggregateReport {
  readonly status: HealthStatus;
  readonly checks: readonly { name: string; status: HealthStatus; note?: string }[];
}

const ORDER: Record<HealthStatus, number> = { ok: 0, degraded: 1, fail: 2 };

export async function aggregate(checks: readonly HealthCheck[]): Promise<AggregateReport> {
  const results = await Promise.all(checks.map(async (c) => {
    try {
      const r = await c.run();
      return { name: c.name, status: r.status, note: r.note };
    } catch (error) {
      return {
        name: c.name, status: 'fail' as HealthStatus,
        note: error instanceof Error ? error.message : String(error),
      };
    }
  }));
  const status = results.reduce<HealthStatus>(
    (worst, r) => (ORDER[r.status] > ORDER[worst] ? r.status : worst),
    'ok',
  );
  return { status, checks: results };
}

export class StaticCheck implements HealthCheck {
  constructor(public readonly name: string, private readonly result: HealthResult) {}
  async run(): Promise<HealthResult> { return this.result; }
}
