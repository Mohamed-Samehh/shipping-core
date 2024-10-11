// Minimal CSV serialiser used by export-job tooling. Handles quoting fields
// that contain commas, quotes or newlines. Parsing only handles the strict
// subset we produce — full RFC 4180 isn't needed here.

export function escapeField(value: unknown): string {
  if (value === undefined || value === null) return '';
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function rowToCsv(values: readonly unknown[]): string {
  return values.map(escapeField).join(',');
}

export function toCsv(rows: ReadonlyArray<readonly unknown[]>, headers?: readonly string[]): string {
  const lines: string[] = [];
  if (headers) lines.push(rowToCsv(headers));
  for (const row of rows) lines.push(rowToCsv(row));
  return lines.join('\n');
}

export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { inQuotes = false; i += 1; continue; }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') { inQuotes = true; i += 1; continue; }
    if (ch === ',') { row.push(field); field = ''; i += 1; continue; }
    if (ch === '\n' || ch === '\r') {
      if (field.length > 0 || row.length > 0) { row.push(field); out.push(row); row = []; field = ''; }
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); out.push(row); }
  return out;
}
