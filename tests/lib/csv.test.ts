import { escapeField, rowToCsv, toCsv, parseCsv } from '../../src/lib/csv';

describe('csv helpers', () => {
  test('escapeField quotes when necessary', () => {
    expect(escapeField('hi')).toBe('hi');
    expect(escapeField('a,b')).toBe('"a,b"');
    expect(escapeField('a"b')).toBe('"a""b"');
  });

  test('rowToCsv joins escaped fields', () => {
    expect(rowToCsv(['a', 'b,c'])).toBe('a,"b,c"');
  });

  test('toCsv emits header then rows', () => {
    const csv = toCsv([[1, 2], [3, 4]], ['a', 'b']);
    expect(csv).toBe('a,b\n1,2\n3,4');
  });

  test('parseCsv roundtrips simple rows', () => {
    const csv = 'a,b\n1,2\n3,4';
    expect(parseCsv(csv)).toEqual([['a', 'b'], ['1', '2'], ['3', '4']]);
  });

  test('parseCsv handles quoted commas', () => {
    expect(parseCsv('a,"b,c"')).toEqual([['a', 'b,c']]);
  });

  test('parseCsv handles escaped quotes', () => {
    expect(parseCsv('"a""b"')).toEqual([['a"b']]);
  });
});
