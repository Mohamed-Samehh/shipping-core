// RFC 6570 level-1 URL template expansion. Sufficient for webhook URL
// templates we issue to integrations.

export function expand(template: string, variables: Record<string, unknown>): string {
  return template.replace(/\{([^}]+)\}/g, (_, name) => {
    const value = variables[name as string];
    if (value === undefined || value === null) return '';
    return encodeURIComponent(String(value));
  });
}

export function extractVariables(template: string): string[] {
  const out = new Set<string>();
  const re = /\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(template)) !== null) out.add(match[1] as string);
  return Array.from(out).sort();
}

export function appendQuery(url: string, params: Record<string, string | number | boolean | undefined>): string {
  const u = new URL(url);
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) u.searchParams.set(key, String(val));
  }
  return u.toString();
}
