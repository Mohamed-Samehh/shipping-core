// Span / tracer abstraction. Service code wraps a unit of work in `tracer.span(
// name, fn)` so each invocation produces a span with start/end/status.

export type SpanStatus = 'ok' | 'error';

export interface SpanRecord {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly status: SpanStatus;
  readonly attrs: Record<string, unknown>;
  readonly error?: string;
}

export interface Tracer {
  span<T>(name: string, fn: (set: (attrs: Record<string, unknown>) => void) => Promise<T> | T,
    attrs?: Record<string, unknown>): Promise<T>;
}

export class InMemoryTracer implements Tracer {
  readonly spans: SpanRecord[] = [];
  constructor(private readonly now: () => number = Date.now) {}

  async span<T>(name: string, fn: (set: (attrs: Record<string, unknown>) => void) => Promise<T> | T,
    initial: Record<string, unknown> = {}): Promise<T> {
    const start = this.now();
    const attrs: Record<string, unknown> = { ...initial };
    const set = (more: Record<string, unknown>) => Object.assign(attrs, more);
    try {
      const result = await fn(set);
      this.spans.push({ name, start, end: this.now(), status: 'ok', attrs });
      return result;
    } catch (error) {
      this.spans.push({
        name, start, end: this.now(), status: 'error', attrs,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  clear(): void { this.spans.length = 0; }
  byName(name: string): SpanRecord[] { return this.spans.filter((s) => s.name === name); }
}
