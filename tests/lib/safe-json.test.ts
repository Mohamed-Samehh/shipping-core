import { safeJsonParse, safeJsonStringify, pretty, omit, pick } from '../../src/lib/safe-json';

describe('safe-json', () => {
  test('parse ok / err', () => {
    expect(safeJsonParse('{}')).toEqual({ ok: true, value: {} });
    expect(safeJsonParse('not json').ok).toBe(false);
  });

  test('stringify ok / err', () => {
    expect(safeJsonStringify({ a: 1 }).ok).toBe(true);
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(safeJsonStringify(circular).ok).toBe(false);
  });

  test('pretty returns fallback string on error', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(pretty(circular).startsWith('<unserialisable')).toBe(true);
  });

  test('omit removes given keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  test('pick keeps given keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});
