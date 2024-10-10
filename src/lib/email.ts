// Email helpers. Normalises to lowercase, validates the common shape and
// supports a blocklist so test fixtures can reject role addresses.

const RE_EMAIL = /^[a-z0-9_.+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

export function normaliseEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return RE_EMAIL.test(value.trim());
}

export function extractDomain(value: string): string | undefined {
  const at = value.lastIndexOf('@');
  if (at < 0) return undefined;
  return value.slice(at + 1).toLowerCase();
}

export function maskEmail(value: string): string {
  const at = value.indexOf('@');
  if (at < 0) return value;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const masked = local.length <= 2 ? local : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}

export function isBlocked(value: string, blocklist: ReadonlySet<string>): boolean {
  return blocklist.has(normaliseEmail(value));
}

const DEFAULT_ROLE_LOCAL_PARTS = new Set([
  'admin', 'support', 'help', 'info', 'contact', 'sales', 'noreply', 'no-reply',
  'postmaster', 'abuse', 'security', 'webmaster',
]);

export function isRoleAddress(value: string): boolean {
  const local = value.split('@', 1)[0]?.toLowerCase() ?? '';
  return DEFAULT_ROLE_LOCAL_PARTS.has(local);
}
