import { z, parse, safeParse } from '../../src/lib/validate';
import { ValidationError } from '../../src/errors';

describe('zod validate adapter', () => {
  const Schema = z.object({ name: z.string(), count: z.number().int() });

  test('parse returns typed value on success', () => {
    const v = parse(Schema, { name: 'a', count: 1 });
    expect(v).toEqual({ name: 'a', count: 1 });
  });

  test('parse throws ValidationError on failure', () => {
    expect(() => parse(Schema, { name: 'a', count: 'x' })).toThrow(ValidationError);
  });

  test('safeParse returns ok on success', () => {
    const r = safeParse(Schema, { name: 'a', count: 1 });
    expect(r.ok).toBe(true);
  });

  test('safeParse returns issues on failure', () => {
    const r = safeParse(Schema, { name: 'a', count: 'x' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.issues.length).toBeGreaterThan(0);
  });

  test('parse context is included in error context', () => {
    try { parse(Schema, {}, 'CreateInput'); }
    catch (e) {
      expect((e as Error).message).toContain('CreateInput');
    }
  });
});
