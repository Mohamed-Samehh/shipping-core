import { haversineKm, bearingDeg, nearest } from '../../src/lib/distance';

describe('distance', () => {
  const sfo = { lat: 37.7749, lng: -122.4194 };
  const lax = { lat: 34.0522, lng: -118.2437 };
  const nyc = { lat: 40.7128, lng: -74.006 };

  test('SFO -> LAX is roughly 560 km', () => {
    expect(haversineKm(sfo, lax)).toBeGreaterThan(550);
    expect(haversineKm(sfo, lax)).toBeLessThan(580);
  });

  test('bearingDeg returns finite number', () => {
    const b = bearingDeg(sfo, nyc);
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(360);
  });

  test('nearest selects closest point', () => {
    expect(nearest(sfo, [nyc, lax])).toBe(lax);
  });

  test('rejects bad lat/lng', () => {
    expect(() => haversineKm({ lat: 100, lng: 0 }, sfo)).toThrow();
  });

  test('nearest of empty returns undefined', () => {
    expect(nearest(sfo, [])).toBeUndefined();
  });
});
