// HMAC-SHA-256 signing for webhook delivery. The shape mirrors a "Stripe-like"
// header — a timestamp plus a v1 signature — and verification rejects stale or
// tampered payloads.

import { createHmac, timingSafeEqual } from 'crypto';

export interface SignatureHeader {
  readonly timestamp: number;
  readonly signature: string;
}

export function sign(payload: string, secret: string, timestamp: number): SignatureHeader {
  if (!secret) throw new Error('signing secret must not be empty');
  const mac = createHmac('sha256', secret);
  mac.update(`${timestamp}.${payload}`);
  return { timestamp, signature: mac.digest('hex') };
}

export function formatHeader(header: SignatureHeader): string {
  return `t=${header.timestamp},v1=${header.signature}`;
}

export function parseHeader(value: string): SignatureHeader | undefined {
  const parts = value.split(',').map((p) => p.trim());
  let timestamp: number | undefined;
  let signature: string | undefined;
  for (const part of parts) {
    const [k, v] = part.split('=', 2);
    if (k === 't' && v) timestamp = Number(v);
    if (k === 'v1' && v) signature = v;
  }
  if (timestamp === undefined || !Number.isFinite(timestamp) || !signature) return undefined;
  return { timestamp, signature };
}

export function verify(payload: string, secret: string, header: SignatureHeader,
  toleranceSec: number, now: number): boolean {
  if (Math.abs(now / 1000 - header.timestamp) > toleranceSec) return false;
  const expected = sign(payload, secret, header.timestamp);
  const a = Buffer.from(expected.signature, 'hex');
  const b = Buffer.from(header.signature, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
