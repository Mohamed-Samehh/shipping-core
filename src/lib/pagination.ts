// Offset / limit pagination + cursor decoding. Service `list*` operations
// return a `Page<T>` so callers can render rows + next/prev hints uniformly.

export interface PageParams {
  readonly offset?: number;
  readonly limit?: number;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
  readonly hasMore: boolean;
}

export function paginate<T>(items: readonly T[], params: PageParams = {}): Page<T> {
  const offset = clampOffset(params.offset ?? 0);
  const limit = clampLimit(params.limit ?? 50);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    total: items.length,
    offset,
    limit,
    hasMore: offset + slice.length < items.length,
  };
}

export function clampLimit(value: number, max = 200): number {
  if (!Number.isInteger(value)) throw new RangeError('limit must be an integer');
  if (value <= 0) return 1;
  return Math.min(value, max);
}

export function clampOffset(value: number): number {
  if (!Number.isInteger(value)) throw new RangeError('offset must be an integer');
  return Math.max(0, value);
}

export function encodeCursor(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(value: string): Record<string, unknown> {
  try {
    const decoded = Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
  } catch {
    // fall through to error throw
  }
  throw new RangeError('invalid cursor');
}
