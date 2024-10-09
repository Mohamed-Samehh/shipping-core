import { sign, formatHeader, parseHeader, verify } from '../../src/lib/signature';

describe('webhook signature', () => {
  test('sign + verify roundtrip', () => {
    const h = sign('payload', 'shh', 1700000000);
    expect(verify('payload', 'shh', h, 300, 1700000000_000)).toBe(true);
  });

  test('verify rejects tampered payload', () => {
    const h = sign('payload', 'shh', 1700000000);
    expect(verify('different', 'shh', h, 300, 1700000000_000)).toBe(false);
  });

  test('verify rejects stale timestamps', () => {
    const h = sign('payload', 'shh', 1700000000);
    expect(verify('payload', 'shh', h, 60, 1700001000_000)).toBe(false);
  });

  test('formatHeader / parseHeader roundtrip', () => {
    const h = sign('payload', 'shh', 1700000000);
    const round = parseHeader(formatHeader(h));
    expect(round).toEqual(h);
  });

  test('parseHeader returns undefined on missing parts', () => {
    expect(parseHeader('garbage')).toBeUndefined();
    expect(parseHeader('t=1')).toBeUndefined();
  });

  test('sign rejects empty secret', () => {
    expect(() => sign('p', '', 1)).toThrow();
  });
});
