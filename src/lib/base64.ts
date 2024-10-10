// base64 / base64url helpers. Node's built-in `Buffer` already covers most of
// it, but we wrap so call sites read intent-revealing names.

export function toBase64(value: string | Buffer): string {
  return Buffer.from(value).toString('base64');
}

export function fromBase64(value: string): string {
  return Buffer.from(value, 'base64').toString('utf8');
}

export function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

export function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function isBase64(value: string): boolean {
  if (value.length === 0) return false;
  if (value.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

export function isBase64Url(value: string): boolean {
  if (value.length === 0) return false;
  return /^[A-Za-z0-9_-]+$/.test(value);
}
