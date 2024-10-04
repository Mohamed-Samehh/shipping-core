import { parseZone, isDomestic, zoneMatches } from '../../src/domain/zone';

const base = {
  id: 'zone_1', carrierId: 'c1', originCountry: 'US',
  destinationCountry: 'US', zone: 3, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Zone schema', () => {
  test('parseZone accepts a valid record', () => {
    expect(parseZone(base).zone).toBe(3);
  });

  test('isDomestic when origin == destination', () => {
    expect(isDomestic(parseZone(base))).toBe(true);
    expect(isDomestic(parseZone({ ...base, destinationCountry: 'CA' }))).toBe(false);
  });

  test('zoneMatches honours country pair', () => {
    expect(zoneMatches(parseZone(base), 'us', 'us')).toBe(true);
    expect(zoneMatches(parseZone(base), 'us', 'ca')).toBe(false);
  });

  test('zoneMatches honours postal-prefix when defined', () => {
    const withPrefix = parseZone({ ...base, originPrefix: '94', destinationPrefix: '10' });
    expect(zoneMatches(withPrefix, 'US', 'US', '94103', '10001')).toBe(true);
    expect(zoneMatches(withPrefix, 'US', 'US', '60601', '10001')).toBe(false);
  });

  test('rejects zero zone', () => {
    expect(() => parseZone({ ...base, zone: 0 })).toThrow();
  });
});
