import { RecordingLogger, JsonLogger } from '../../src/lib/logger';

describe('RecordingLogger', () => {
  test('records each level when minLevel allows', () => {
    const log = new RecordingLogger();
    log.info('a');
    log.warn('b');
    log.error('c');
    expect(log.records.map((r) => r.msg)).toEqual(['a', 'b', 'c']);
  });

  test('filters by minLevel', () => {
    const log = new RecordingLogger({}, 'warn');
    log.info('skip');
    log.warn('keep');
    expect(log.records.map((r) => r.msg)).toEqual(['keep']);
  });

  test('child merges bound fields', () => {
    const log = new RecordingLogger({ a: 1 });
    const child = log.child({ b: 2 });
    child.info('m', { c: 3 });
    expect((child as RecordingLogger).records[0]!.fields).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('byLevel filters records', () => {
    const log = new RecordingLogger();
    log.info('i');
    log.warn('w');
    expect(log.byLevel('warn')).toHaveLength(1);
  });

  test('clear empties records', () => {
    const log = new RecordingLogger();
    log.info('a');
    log.clear();
    expect(log.records).toHaveLength(0);
  });
});

describe('JsonLogger', () => {
  test('emits JSON lines to sink at minLevel', () => {
    const lines: string[] = [];
    const log = new JsonLogger('info', (l) => lines.push(l));
    log.debug('d');
    log.info('i');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]!).msg).toBe('i');
  });
});
