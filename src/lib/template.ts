// Tiny `{{var}}` template renderer used to format webhook payloads and audit
// log lines. No conditionals, no loops -- by design.

export interface RenderOptions {
  readonly strict?: boolean;
}

export function render(template: string, context: Record<string, unknown>,
  options: RenderOptions = {}): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, expr) => {
    const value = resolve(context, expr as string);
    if (value === undefined) {
      if (options.strict) throw new RangeError(`missing template variable: ${expr}`);
      return '';
    }
    return typeof value === 'string' ? value : String(value);
  });
}

export function extractVariables(template: string): string[] {
  const out = new Set<string>();
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  let m;
  while ((m = re.exec(template)) !== null) out.add(m[1] as string);
  return Array.from(out).sort();
}

function resolve(context: Record<string, unknown>, expr: string): unknown {
  let current: unknown = context;
  for (const part of expr.split('.')) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}
