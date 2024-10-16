import { expandOccurrences, nextAfter, countOccurrences } from '../../src/lib/recurrence';

const day = 86_400_000;
const week = 7 * day;

describe('recurrence', () => {
  test('daily yields each day', () => {
    const out = [...expandOccurrences({ frequency: 'daily', interval: 1, startMs: 0, count: 3 })];
    expect(out).toEqual([0, day, 2 * day]);
  });

  test('weekly interval=2', () => {
    const out = [...expandOccurrences({ frequency: 'weekly', interval: 2, startMs: 0, count: 3 })];
    expect(out).toEqual([0, 2 * week, 4 * week]);
  });

  test('monthly spans calendar months', () => {
    const start = Date.UTC(2024, 0, 31);
    const out = [...expandOccurrences({ frequency: 'monthly', interval: 1, startMs: start, count: 2 })];
    expect(new Date(out[1] as number).getUTCMonth()).toBe(2);
  });

  test('endMs bounds output', () => {
    const out = [...expandOccurrences({ frequency: 'daily', interval: 1, startMs: 0, endMs: 2.5 * day })];
    expect(out.length).toBe(3);
  });

  test('nextAfter returns first ts after marker', () => {
    expect(nextAfter({ frequency: 'daily', interval: 1, startMs: 0, count: 5 }, day)).toBe(2 * day);
  });

  test('countOccurrences', () => {
    expect(countOccurrences({ frequency: 'daily', interval: 1, startMs: 0 }, 4 * day)).toBe(5);
  });
});
