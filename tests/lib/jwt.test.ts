import { signHs256, verifyHs256 } from '../../src/lib/jwt';

describe('HS256 jwt', () => {
  test('sign + verify roundtrip', () => {
    const token = signHs256({ sub: 'u1' }, 'secret', 1700000000_000);
    const r = verifyHs256(token, 'secret', 1700000000_000);
    expect(r.ok).toBe(true);
    expect(r.payload?.sub).toBe('u1');
  });

  test('tampered signature is rejected', () => {
    const token = signHs256({ sub: 'u1' }, 'secret', 1700000000_000);
    const tampered = token.slice(0, -2) + 'aa';
    expect(verifyHs256(tampered, 'secret', 1700000000_000).ok).toBe(false);
  });

  test('expired token is rejected', () => {
    const token = signHs256({}, 'secret', 1700000000_000, { expiresInSec: 60 });
    expect(verifyHs256(token, 'secret', 1700000200_000).ok).toBe(false);
  });

  test('issuer and subject are included', () => {
    const token = signHs256({}, 's', 0, { issuer: 'iss', subject: 'sub' });
    const r = verifyHs256(token, 's', 0);
    expect(r.payload?.iss).toBe('iss');
    expect(r.payload?.sub).toBe('sub');
  });

  test('returns reason on format error', () => {
    const r = verifyHs256('not.a.token', 's', 0);
    expect(r.ok).toBe(false);
  });
});
