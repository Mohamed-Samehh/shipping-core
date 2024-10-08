import { CounterIdGenerator, shortId, isShortId, prefixedId } from '../../src/lib/id';

describe('CounterIdGenerator', () => {
  test('produces monotonically increasing ids', () => {
    const gen = new CounterIdGenerator('shp');
    expect(gen.next()).toBe('shp_00000001');
    expect(gen.next()).toBe('shp_00000002');
    expect(gen.next('lbl')).toBe('lbl_00000003');
  });

  test('peek does not advance counter', () => {
    const gen = new CounterIdGenerator('shp');
    expect(gen.peek()).toBe('shp_00000001');
    expect(gen.peek()).toBe('shp_00000001');
    expect(gen.next()).toBe('shp_00000001');
  });

  test('reset zeroes counter', () => {
    const gen = new CounterIdGenerator('x');
    gen.next();
    gen.next();
    gen.reset();
    expect(gen.next()).toBe('x_00000001');
  });

  test('rejects blank prefix', () => {
    const gen = new CounterIdGenerator();
    expect(() => gen.next('  ')).toThrow();
  });
});

describe('shortId / isShortId', () => {
  test('shortId is deterministic for a given seed', () => {
    expect(shortId(123, 6)).toBe(shortId(123, 6));
    expect(shortId(123, 6)).not.toBe(shortId(124, 6));
  });

  test('shortId pads to requested length', () => {
    expect(shortId(0, 8).length).toBe(8);
    expect(shortId(5, 4).length).toBe(4);
  });

  test('isShortId checks alphabet membership', () => {
    expect(isShortId('abc012')).toBe(true);
    expect(isShortId('ABC012')).toBe(false);
    expect(isShortId('')).toBe(false);
  });
});

describe('prefixedId', () => {
  test('formats with zero-padded counter', () => {
    expect(prefixedId('shp', 5)).toBe('shp_00000005');
  });

  test('rejects invalid prefixes', () => {
    expect(() => prefixedId('1bad', 1)).toThrow();
    expect(() => prefixedId('Bad', 1)).toThrow();
  });

  test('rejects negative counter', () => {
    expect(() => prefixedId('shp', -1)).toThrow();
  });
});
