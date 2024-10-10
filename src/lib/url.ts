// URL builder used by webhook delivery and the api router. Wraps the WHATWG
// URL but normalises slashes when joining path segments.

export function buildUrl(base: string, ...segments: string[]): string {
  const url = new URL(base);
  for (const segment of segments) {
    if (!segment) continue;
    url.pathname = trimTrailingSlash(url.pathname) + '/' + trimLeadingSlash(segment);
  }
  return url.toString();
}

export function trimLeadingSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1) : value;
}

export function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function withQuery(url: string, params: Record<string, string | number | boolean | undefined>): string {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) u.searchParams.delete(k);
    else u.searchParams.set(k, String(v));
  }
  return u.toString();
}

export function parseQuery(url: string): Record<string, string> {
  const u = new URL(url);
  return Object.fromEntries(u.searchParams.entries());
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
