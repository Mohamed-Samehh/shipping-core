import { parseContract, isContractActive } from '../../src/domain/contract';

const base = {
  id: 'ct_1', customerId: 'cu1', name: 'Standard',
  status: 'active' as const,
  effectiveAt: 100, expiresAt: 1000,
  carrierIds: [], discountIds: [],
  metadata: {}, createdAt: 0, updatedAt: 0,
};

describe('Contract schema', () => {
  test('parseContract accepts a valid record', () => {
    expect(parseContract(base).name).toBe('Standard');
  });

  test('isContractActive within window and active status', () => {
    expect(isContractActive(parseContract(base), 500)).toBe(true);
    expect(isContractActive(parseContract({ ...base, status: 'draft' }), 500)).toBe(false);
    expect(isContractActive(parseContract(base), 50)).toBe(false);
    expect(isContractActive(parseContract(base), 2000)).toBe(false);
  });

  test('rejects unknown status', () => {
    expect(() => parseContract({ ...base, status: 'pending' as never })).toThrow();
  });
});
