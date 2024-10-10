// Great-circle distance using Haversine. Used by the dispatcher to choose
// the closest pickup depot.

const EARTH_RADIUS_KM = 6371;

export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  assertLatLng(a);
  assertLatLng(b);
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearingDeg(a: LatLng, b: LatLng): number {
  assertLatLng(a);
  assertLatLng(b);
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function nearest<T extends LatLng>(origin: LatLng, points: readonly T[]): T | undefined {
  if (points.length === 0) return undefined;
  let best = points[0] as T;
  let bestDist = haversineKm(origin, best);
  for (let i = 1; i < points.length; i++) {
    const candidate = points[i] as T;
    const d = haversineKm(origin, candidate);
    if (d < bestDist) { best = candidate; bestDist = d; }
  }
  return best;
}

function assertLatLng(p: LatLng): void {
  if (!Number.isFinite(p.lat) || p.lat < -90 || p.lat > 90) {
    throw new RangeError(`bad lat: ${p.lat}`);
  }
  if (!Number.isFinite(p.lng) || p.lng < -180 || p.lng > 180) {
    throw new RangeError(`bad lng: ${p.lng}`);
  }
}
