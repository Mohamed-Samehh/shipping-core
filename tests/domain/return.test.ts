import { parseReturn, isReturnOpen } from '../../src/domain/return';

const base = {
  id: 'ret_1', customerId: 'cu1', outboundShipmentId: 'sh1',
  status: 'requested' as const, reason: 'damaged' as const,
  metadata: {}, createdAt: 0, updatedAt: 0,
};

describe('Return schema', () => {
  test('parseReturn accepts a valid record', () => {
    expect(parseReturn(base).reason).toBe('damaged');
  });

  test('isReturnOpen for non-terminal status', () => {
    expect(isReturnOpen(parseReturn(base))).toBe(true);
    expect(isReturnOpen(parseReturn({ ...base, status: 'closed' }))).toBe(false);
    expect(isReturnOpen(parseReturn({ ...base, status: 'rejected' }))).toBe(false);
  });

  test('rejects unknown reason', () => {
    expect(() => parseReturn({ ...base, reason: 'forgotten' as never })).toThrow();
  });
});
