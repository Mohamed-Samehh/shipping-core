// Tiny string helpers. Most are pre-vetted single liners that survived a
// refactor without losing test coverage.

export function trim(value: string): string { return value.trim(); }

export function isBlank(value: string): boolean { return value.trim().length === 0; }

export function leftPad(value: string, length: number, ch = ' '): string {
  if (ch.length !== 1) throw new RangeError('leftPad padding must be a single char');
  if (value.length >= length) return value;
  return ch.repeat(length - value.length) + value;
}

export function rightPad(value: string, length: number, ch = ' '): string {
  if (ch.length !== 1) throw new RangeError('rightPad padding must be a single char');
  if (value.length >= length) return value;
  return value + ch.repeat(length - value.length);
}

export function truncate(value: string, max: number, suffix = '\u2026'): string {
  if (value.length <= max) return value;
  return value.slice(0, Math.max(0, max - suffix.length)) + suffix;
}

export function camelCase(value: string): string {
  return value.toLowerCase().replace(/[-_\s]+(.)?/g, (_, ch) => (ch ? ch.toUpperCase() : ''));
}

export function snakeCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export function kebabCase(value: string): string {
  return snakeCase(value).replace(/_/g, '-');
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
