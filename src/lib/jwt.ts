// Tiny HS256 JWT signer / verifier used by webhook delivery and by the api
// auth helper. NOT a full JOSE implementation -- only HS256, no RS, no key
// rotation here.

import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  readonly [key: string]: unknown;
}

export interface JwtOptions {
  readonly expiresInSec?: number;
  readonly issuer?: string;
  readonly subject?: string;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(value: string): Buffer {
  const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export function signHs256(payload: JwtPayload, secret: string, now: number,
  options: JwtOptions = {}): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body: Record<string, unknown> = { ...payload };
  body.iat = Math.floor(now / 1000);
  if (options.expiresInSec) body.exp = body.iat as number + options.expiresInSec;
  if (options.issuer) body.iss = options.issuer;
  if (options.subject) body.sub = options.subject;
  const h = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const p = base64UrlEncode(Buffer.from(JSON.stringify(body)));
  const sig = createHmac('sha256', secret).update(`${h}.${p}`).digest();
  return `${h}.${p}.${base64UrlEncode(sig)}`;
}

export interface JwtVerifyResult {
  readonly ok: boolean;
  readonly payload?: JwtPayload;
  readonly reason?: string;
}

export function verifyHs256(token: string, secret: string, now: number): JwtVerifyResult {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'invalid_format' };
  const [h, p, s] = parts as [string, string, string];
  const expected = base64UrlEncode(createHmac('sha256', secret).update(`${h}.${p}`).digest());
  const expectedBuf = base64UrlDecode(expected);
  const providedBuf = base64UrlDecode(s);
  if (expectedBuf.length !== providedBuf.length) return { ok: false, reason: 'bad_signature' };
  if (!timingSafeEqual(expectedBuf, providedBuf)) return { ok: false, reason: 'bad_signature' };
  let payload: JwtPayload;
  try { payload = JSON.parse(base64UrlDecode(p).toString('utf8')) as JwtPayload; }
  catch { return { ok: false, reason: 'bad_payload' }; }
  const exp = (payload as { exp?: number }).exp;
  if (typeof exp === 'number' && exp * 1000 < now) return { ok: false, reason: 'expired', payload };
  return { ok: true, payload };
}
