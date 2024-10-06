import { parseCustomsDeclaration, isGift } from '../../src/domain/customs-declaration';

const base = {
  id: 'cd_1', shipmentId: 's1', type: 'merchandise' as const,
  incoterm: 'DAP', metadata: {}, createdAt: 0, updatedAt: 0,
};

describe('CustomsDeclaration schema', () => {
  test('parseCustomsDeclaration accepts a valid record', () => {
    expect(parseCustomsDeclaration(base).type).toBe('merchandise');
  });

  test('defaults incoterm to DAP', () => {
    const { incoterm: _i, ...without } = base;
    expect(parseCustomsDeclaration(without).incoterm).toBe('DAP');
  });

  test('isGift', () => {
    expect(isGift(parseCustomsDeclaration({ ...base, type: 'gift' }))).toBe(true);
    expect(isGift(parseCustomsDeclaration(base))).toBe(false);
  });

  test('rejects unknown type', () => {
    expect(() => parseCustomsDeclaration({ ...base, type: 'wedding' as never })).toThrow();
  });
});
