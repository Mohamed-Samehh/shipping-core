import { parseDuration, formatDuration, DAY_MS, HOUR_MS } from '../../src/lib/duration';

describe('duration', () => {
  test('parseDuration handles compound input', () => {
    expect(parseDuration('1h 30m')).toBe(HOUR_MS + 30 * 60 * 1000);
  });

  test('parseDuration handles fractions', () => {
    expect(parseDuration('1.5h')).toBe(1.5 * HOUR_MS);
  });

  test('parseDuration rejects unknown units', () => {
    expect(() => parseDuration('1y')).toThrow();
  });

  test('parseDuration rejects empty', () => {
    expect(() => parseDuration('')).toThrow();
  });

  test('formatDuration outputs largest units', () => {
    expect(formatDuration(DAY_MS + HOUR_MS)).toBe('1d 1h');
  });

  test('formatDuration zero gives 0s', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  test('formatDuration negative carries sign', () => {
    expect(formatDuration(-HOUR_MS)).toBe('-1h');
  });
});
