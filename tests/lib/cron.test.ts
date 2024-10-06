import { parseCron, matches, nextAfter } from '../../src/lib/cron';

describe('cron parser', () => {
  test('parses 5-field expression', () => {
    const s = parseCron('* * * * *');
    expect(s.minute.size).toBe(60);
  });

  test('rejects bad arity', () => {
    expect(() => parseCron('* *')).toThrow();
  });

  test('range and step', () => {
    const s = parseCron('0 0,12 * * *');
    expect([...s.hour].sort((a, b) => a - b)).toEqual([0, 12]);
  });

  test('matches a known timestamp', () => {
    const noon = Date.UTC(2024, 0, 1, 12, 0);
    expect(matches(parseCron('0 12 * * *'), noon)).toBe(true);
    expect(matches(parseCron('0 13 * * *'), noon)).toBe(false);
  });

  test('nextAfter returns next minute match', () => {
    const s = parseCron('0 12 * * *');
    const next = nextAfter(s, Date.UTC(2024, 0, 1, 11, 30));
    expect(next).toBe(Date.UTC(2024, 0, 1, 12, 0));
  });

  test('rejects out of range minute', () => {
    expect(() => parseCron('70 * * * *')).toThrow();
  });
});
