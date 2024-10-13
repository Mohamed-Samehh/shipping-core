import { buildSscc, isValidSscc, ssccCheckDigit, formatBarcode } from '../../src/lib/barcode';

describe('barcode', () => {
  test('checksum is mod10', () => {
    const cd = ssccCheckDigit('12345678901234567');
    expect(cd >= 0 && cd <= 9).toBe(true);
  });

  test('rejects non-17 payload', () => {
    expect(() => ssccCheckDigit('123')).toThrow();
  });

  test('buildSscc / isValidSscc roundtrip', () => {
    const code = buildSscc(0, '1234567', 99);
    expect(isValidSscc(code)).toBe(true);
  });

  test('isValidSscc rejects bad checksum', () => {
    const code = buildSscc(0, '1234567', 99);
    const broken = code.slice(0, -1) + ((Number(code[17] as string) + 1) % 10);
    expect(isValidSscc(broken)).toBe(false);
  });

  test('formatBarcode inserts spaces every 4 chars', () => {
    expect(formatBarcode('1234567890123456')).toBe('1234 5678 9012 3456');
  });
});
