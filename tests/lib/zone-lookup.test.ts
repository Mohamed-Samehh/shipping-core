import { zoneLookup, isLocalZone, isLongHaulZone } from '../../src/lib/zone-lookup';

describe('zone-lookup', () => {
  test('same prefix is zone 1', () => {
    expect(zoneLookup('94103', '94104')).toBe(1);
  });

  test('cross-country prefix is high zone', () => {
    expect(zoneLookup('94103', '10001')).toBeGreaterThanOrEqual(6);
  });

  test('unknown prefix falls back to heuristic', () => {
    expect(zoneLookup('55555', '55556')).toBeGreaterThanOrEqual(2);
  });

  test('isLocalZone for zone 1/2', () => {
    expect(isLocalZone(1)).toBe(true);
    expect(isLocalZone(2)).toBe(true);
    expect(isLocalZone(3)).toBe(false);
  });

  test('isLongHaulZone for zone 7+', () => {
    expect(isLongHaulZone(7)).toBe(true);
    expect(isLongHaulZone(6)).toBe(false);
  });

  test('non-numeric input falls through to default', () => {
    expect(zoneLookup('AB', 'CD')).toBeGreaterThanOrEqual(2);
  });
});
