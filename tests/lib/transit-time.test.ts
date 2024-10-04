import { estimateTransit, isOnTime, delayDays } from '../../src/lib/transit-time';

const dispatch = Date.parse('2025-04-21T10:00:00Z'); // Monday

describe('estimateTransit', () => {
  test('business-day estimate', () => {
    const e = estimateTransit(dispatch, { transitDaysMin: 1, transitDaysMax: 3 });
    expect(new Date(e.earliest).toISOString().slice(0, 10)).toBe('2025-04-22');
    expect(new Date(e.latest).toISOString().slice(0, 10)).toBe('2025-04-24');
  });

  test('weekendDelivery=true uses calendar days', () => {
    const e = estimateTransit(dispatch, { transitDaysMin: 1, transitDaysMax: 7, weekendDelivery: true });
    const sevenDays = new Date(dispatch + 7 * 86_400_000);
    expect(new Date(e.latest).toISOString()).toBe(sevenDays.toISOString());
  });

  test('honours holiday set', () => {
    const e = estimateTransit(dispatch, {
      transitDaysMin: 1, transitDaysMax: 1,
      holidays: new Set(['2025-04-22']),
    });
    expect(new Date(e.earliest).toISOString().slice(0, 10)).toBe('2025-04-23');
  });

  test('isOnTime respects latest', () => {
    const e = estimateTransit(dispatch, { transitDaysMin: 1, transitDaysMax: 3 });
    expect(isOnTime(e.latest, e)).toBe(true);
    expect(isOnTime(e.latest + 86_400_000, e)).toBe(false);
  });

  test('delayDays rounds up partial days', () => {
    const e = estimateTransit(dispatch, { transitDaysMin: 1, transitDaysMax: 3 });
    expect(delayDays(e.latest + 86_400_000 + 1000, e)).toBe(2);
    expect(delayDays(e.latest, e)).toBe(0);
  });

  test('rejects bad bounds', () => {
    expect(() => estimateTransit(0, { transitDaysMin: 5, transitDaysMax: 2 })).toThrow();
  });
});
