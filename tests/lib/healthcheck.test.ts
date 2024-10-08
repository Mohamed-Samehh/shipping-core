import { aggregate, StaticCheck } from '../../src/lib/healthcheck';

describe('healthcheck aggregator', () => {
  test('returns ok when all checks pass', async () => {
    const out = await aggregate([new StaticCheck('a', { status: 'ok' })]);
    expect(out.status).toBe('ok');
  });

  test('promotes worst to degraded then fail', async () => {
    const out = await aggregate([
      new StaticCheck('a', { status: 'ok' }),
      new StaticCheck('b', { status: 'degraded' }),
    ]);
    expect(out.status).toBe('degraded');
  });

  test('throws are caught as fail', async () => {
    const out = await aggregate([{
      name: 'x',
      run: async () => { throw new Error('boom'); },
    }]);
    expect(out.status).toBe('fail');
    expect(out.checks[0]!.note).toContain('boom');
  });

  test('includes individual statuses in checks list', async () => {
    const out = await aggregate([
      new StaticCheck('a', { status: 'ok' }),
      new StaticCheck('b', { status: 'fail', note: 'down' }),
    ]);
    expect(out.checks.map((c) => c.status)).toEqual(['ok', 'fail']);
  });
});
