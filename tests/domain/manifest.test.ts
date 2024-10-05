import { parseManifest, isManifestOpen, isManifestClosed, isManifestDispatched } from '../../src/domain/manifest';

const base = {
  id: 'mf_1', carrierId: 'c1', accountId: 'a1', locationId: 'l1',
  status: 'open' as const, totalShipments: 0, totalWeightG: 0,
  metadata: {}, createdAt: 0, updatedAt: 0,
};

describe('Manifest schema', () => {
  test('parseManifest accepts a valid record', () => {
    expect(parseManifest(base).status).toBe('open');
  });

  test('isManifestOpen only for open', () => {
    expect(isManifestOpen(parseManifest(base))).toBe(true);
    expect(isManifestOpen(parseManifest({ ...base, status: 'closed' }))).toBe(false);
  });

  test('isManifestClosed for closed or dispatched', () => {
    expect(isManifestClosed(parseManifest({ ...base, status: 'closed' }))).toBe(true);
    expect(isManifestClosed(parseManifest({ ...base, status: 'dispatched' }))).toBe(true);
    expect(isManifestClosed(parseManifest(base))).toBe(false);
  });

  test('isManifestDispatched only for dispatched', () => {
    expect(isManifestDispatched(parseManifest({ ...base, status: 'dispatched' }))).toBe(true);
    expect(isManifestDispatched(parseManifest({ ...base, status: 'closed' }))).toBe(false);
  });

  test('rejects unknown status', () => {
    expect(() => parseManifest({ ...base, status: 'shipped' as never })).toThrow();
  });
});
