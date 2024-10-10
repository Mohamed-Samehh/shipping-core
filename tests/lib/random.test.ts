import { Mulberry32 } from '../../src/lib/random';

describe('Mulberry32', () => {
  test('seeded prng is deterministic', () => {
    const a = new Mulberry32(42);
    const b = new Mulberry32(42);
    for (let i = 0; i < 10; i++) expect(a.next()).toBeCloseTo(b.next());
  });

  test('int respects bounds inclusive', () => {
    const r = new Mulberry32(1);
    for (let i = 0; i < 100; i++) {
      const v = r.int(2, 5);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(5);
    }
  });

  test('shuffle returns same elements', () => {
    const r = new Mulberry32(7);
    const input = [1, 2, 3, 4, 5];
    const shuffled = r.shuffle(input);
    expect(shuffled.sort()).toEqual(input.sort());
  });

  test('pick returns one of the elements', () => {
    const r = new Mulberry32(7);
    const values = ['a', 'b', 'c'];
    for (let i = 0; i < 50; i++) expect(values).toContain(r.pick(values));
  });

  test('seed must be finite', () => {
    expect(() => new Mulberry32(Infinity)).toThrow();
  });

  test('shuffle preserves length', () => {
    const r = new Mulberry32(11);
    expect(r.shuffle([1, 2, 3, 4]).length).toBe(4);
  });
});
