import { fnv1a32, fnv1aHex, sha256Hex, shortFingerprint, canonicalJSON, fingerprintObject } from '../../src/lib/hash';

describe('hash helpers', () => {
  test('fnv1a32 is deterministic', () => {
    expect(fnv1a32('abc')).toBe(fnv1a32('abc'));
    expect(fnv1a32('abc')).not.toBe(fnv1a32('abd'));
  });

  test('fnv1aHex returns 8 hex chars', () => {
    expect(fnv1aHex('shipment')).toMatch(/^[0-9a-f]{8}$/);
  });

  test('sha256Hex matches known vector', () => {
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  test('shortFingerprint length is configurable', () => {
    expect(shortFingerprint('payload', 8).length).toBe(8);
    expect(shortFingerprint('payload', 16).length).toBe(16);
  });

  test('shortFingerprint rejects out-of-range length', () => {
    expect(() => shortFingerprint('p', 3)).toThrow();
    expect(() => shortFingerprint('p', 64)).toThrow();
  });

  test('canonicalJSON sorts object keys', () => {
    const a = canonicalJSON({ b: 1, a: 2 });
    const b = canonicalJSON({ a: 2, b: 1 });
    expect(a).toBe(b);
  });

  test('fingerprintObject ignores key order', () => {
    expect(fingerprintObject({ a: 1, b: 2 })).toBe(fingerprintObject({ b: 2, a: 1 }));
  });
});
