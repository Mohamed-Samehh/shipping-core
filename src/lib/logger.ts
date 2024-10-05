// Tiny structured logger. Production callers wire `JsonLogger` to a sink that
// forwards to a real backend; tests use `RecordingLogger` and assert on the
// captured log lines.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogRecord {
  level: LogLevel;
  msg: string;
  fields: Record<string, unknown>;
  ts: number;
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface Logger {
  debug(msg: string, fields?: Record<string, unknown>): void;
  info(msg: string, fields?: Record<string, unknown>): void;
  warn(msg: string, fields?: Record<string, unknown>): void;
  error(msg: string, fields?: Record<string, unknown>): void;
  child(fields: Record<string, unknown>): Logger;
}

export class RecordingLogger implements Logger {
  readonly records: LogRecord[] = [];
  private readonly bound: Record<string, unknown>;

  constructor(bound: Record<string, unknown> = {}, private readonly minLevel: LogLevel = 'debug') {
    this.bound = bound;
  }

  private push(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    this.records.push({ level, msg, fields: { ...this.bound, ...(fields ?? {}) }, ts: Date.now() });
  }

  debug(msg: string, fields?: Record<string, unknown>): void { this.push('debug', msg, fields); }
  info(msg: string, fields?: Record<string, unknown>): void { this.push('info', msg, fields); }
  warn(msg: string, fields?: Record<string, unknown>): void { this.push('warn', msg, fields); }
  error(msg: string, fields?: Record<string, unknown>): void { this.push('error', msg, fields); }

  child(fields: Record<string, unknown>): Logger {
    return new RecordingLogger({ ...this.bound, ...fields }, this.minLevel);
  }

  clear(): void { this.records.length = 0; }
  byLevel(level: LogLevel): LogRecord[] { return this.records.filter((r) => r.level === level); }
}

export class JsonLogger implements Logger {
  constructor(private readonly minLevel: LogLevel = 'info',
              private readonly sink: (line: string) => void = (l) => console.error(l),
              private readonly bound: Record<string, unknown> = {}) {}

  private emit(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    const record = { level, msg, ts: new Date().toISOString(), ...this.bound, ...(fields ?? {}) };
    this.sink(JSON.stringify(record));
  }

  debug(msg: string, fields?: Record<string, unknown>): void { this.emit('debug', msg, fields); }
  info(msg: string, fields?: Record<string, unknown>): void { this.emit('info', msg, fields); }
  warn(msg: string, fields?: Record<string, unknown>): void { this.emit('warn', msg, fields); }
  error(msg: string, fields?: Record<string, unknown>): void { this.emit('error', msg, fields); }

  child(fields: Record<string, unknown>): Logger {
    return new JsonLogger(this.minLevel, this.sink, { ...this.bound, ...fields });
  }
}
