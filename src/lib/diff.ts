// Cheap object diff used by audit logging to capture the smallest payload
// that describes a change.

export interface ObjectDiff {
  readonly added: Record<string, unknown>;
  readonly removed: Record<string, unknown>;
  readonly changed: Record<string, { before: unknown; after: unknown }>;
}

export function shallowDiff<T extends Record<string, unknown>>(before: T, after: T): ObjectDiff {
  const added: Record<string, unknown> = {};
  const removed: Record<string, unknown> = {};
  const changed: Record<string, { before: unknown; after: unknown }> = {};
  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));
  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) added[key] = after[key];
    else if (!deepEqual(before[key], after[key])) {
      changed[key] = { before: before[key], after: after[key] };
    }
  }
  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) removed[key] = before[key];
  }
  return { added, removed, changed };
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== (b as unknown[]).length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], (b as unknown[])[i])) return false;
    }
    return true;
  }
  const aKeys = Object.keys(a as Record<string, unknown>);
  const bKeys = Object.keys(b as Record<string, unknown>);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }
  return true;
}

export function diffIsEmpty(diff: ObjectDiff): boolean {
  return Object.keys(diff.added).length === 0
    && Object.keys(diff.removed).length === 0
    && Object.keys(diff.changed).length === 0;
}
