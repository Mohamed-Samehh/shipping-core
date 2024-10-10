import { startOfDayUtc, endOfDayUtc, addDaysUtc, addBusinessDaysUtc, isWeekendUtc, toIsoDate, fromIsoDate, diffDaysUtc, ONE_DAY_MS } from '../../src/lib/time';

const mid = Date.parse('2024-10-15T12:34:56Z');

describe('time helpers', () => {
  test('startOfDayUtc strips intra-day component', () => {
    expect(toIsoDate(startOfDayUtc(mid))).toBe('2024-10-15');
  });

  test('endOfDayUtc is start + day - 1ms', () => {
    expect(endOfDayUtc(mid)).toBe(startOfDayUtc(mid) + ONE_DAY_MS - 1);
  });

  test('addDaysUtc respects whole days', () => {
    expect(toIsoDate(addDaysUtc(mid, 3))).toBe('2024-10-18');
  });

  test('addBusinessDaysUtc skips weekends', () => {
    const friday = fromIsoDate('2024-10-18');
    const next = addBusinessDaysUtc(friday, 1);
    expect(toIsoDate(next)).toBe('2024-10-21');
  });

  test('addBusinessDaysUtc respects supplied holidays', () => {
    const monday = fromIsoDate('2024-10-21');
    const next = addBusinessDaysUtc(monday, 1, new Set(['2024-10-22']));
    expect(toIsoDate(next)).toBe('2024-10-23');
  });

  test('isWeekendUtc detects saturday and sunday', () => {
    expect(isWeekendUtc(fromIsoDate('2024-10-19'))).toBe(true);
    expect(isWeekendUtc(fromIsoDate('2024-10-21'))).toBe(false);
  });

  test('toIsoDate / fromIsoDate roundtrip', () => {
    expect(toIsoDate(fromIsoDate('2025-01-15'))).toBe('2025-01-15');
  });

  test('diffDaysUtc returns whole days', () => {
    expect(diffDaysUtc(fromIsoDate('2025-01-10'), fromIsoDate('2025-01-01'))).toBe(9);
  });

  test('addBusinessDaysUtc handles backwards', () => {
    const friday = fromIsoDate('2024-10-18');
    const prev = addBusinessDaysUtc(friday, -1);
    expect(toIsoDate(prev)).toBe('2024-10-17');
  });

  test('fromIsoDate rejects invalid format', () => {
    expect(() => fromIsoDate('10/15/2024')).toThrow();
  });
});
