import { parseLabel, isLabelActive, isLabelVoidable } from '../../src/domain/label';

const base = {
  id: 'lbl_1', shipmentId: 's1', packageId: 'p1',
  trackingNumber: '1Z01', format: 'pdf' as const,
  status: 'issued' as const,
  url: 'https://x.test/l.pdf', expiresAt: 2000,
  createdAt: 0, updatedAt: 0,
};

describe('Label schema', () => {
  test('parseLabel accepts a valid record', () => {
    expect(parseLabel(base).format).toBe('pdf');
  });

  test('rejects unknown format', () => {
    expect(() => parseLabel({ ...base, format: 'jpeg' as never })).toThrow();
  });

  test('isLabelActive needs issued status and future expiry', () => {
    expect(isLabelActive(parseLabel(base), 1500)).toBe(true);
    expect(isLabelActive(parseLabel(base), 2500)).toBe(false);
    expect(isLabelActive(parseLabel({ ...base, status: 'voided' }), 1500)).toBe(false);
  });

  test('isLabelVoidable only when issued', () => {
    expect(isLabelVoidable(parseLabel(base))).toBe(true);
    expect(isLabelVoidable(parseLabel({ ...base, status: 'voided' }))).toBe(false);
    expect(isLabelVoidable(parseLabel({ ...base, status: 'expired' }))).toBe(false);
  });

  test('rejects bad url', () => {
    expect(() => parseLabel({ ...base, url: 'not a url' })).toThrow();
  });
});
