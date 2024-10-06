import { InMemoryTracer } from '../../src/lib/tracing';

describe('InMemoryTracer', () => {
  test('records span on success', async () => {
    const t = new InMemoryTracer();
    await t.span('op', () => Promise.resolve(7));
    expect(t.spans[0]!.status).toBe('ok');
  });

  test('records span on error and rethrows', async () => {
    const t = new InMemoryTracer();
    await expect(t.span('op', async () => { throw new Error('x'); })).rejects.toThrow('x');
    expect(t.spans[0]!.status).toBe('error');
  });

  test('set merges attrs', async () => {
    const t = new InMemoryTracer();
    await t.span('op', (set) => { set({ a: 1 }); return 1; }, { b: 2 });
    expect(t.spans[0]!.attrs).toEqual({ a: 1, b: 2 });
  });

  test('byName filters spans', async () => {
    const t = new InMemoryTracer();
    await t.span('a', () => 1);
    await t.span('b', () => 2);
    expect(t.byName('a')).toHaveLength(1);
  });
});
