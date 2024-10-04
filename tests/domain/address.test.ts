import { parseAddress, normaliseAddress, isValidAddress, isInternational, AddressSchema } from '../../src/domain/address';

const base = {
  id: 'addr_1', name: 'Ana', street1: '1 Main', city: 'SF',
  postalCode: '94103', country: 'US', isResidential: false,
  createdAt: 0, updatedAt: 0,
};

describe('Address schema', () => {
  test('parseAddress accepts a valid record', () => {
    expect(parseAddress(base).country).toBe('US');
  });

  test('rejects empty street1', () => {
    expect(() => parseAddress({ ...base, street1: '' })).toThrow();
  });

  test('rejects bad country code', () => {
    expect(() => parseAddress({ ...base, country: 'USA' })).toThrow();
  });

  test('normaliseAddress uppercases country and formats postal', () => {
    const out = normaliseAddress({ ...base, country: 'ca', postalCode: 'k1a0b1' });
    expect(out.country).toBe('CA');
    expect(out.postalCode).toBe('K1A 0B1');
  });

  test('isValidAddress passes for known postal/country', () => {
    expect(isValidAddress(parseAddress(base))).toBe(true);
  });

  test('isInternational compares country codes', () => {
    const us = parseAddress(base);
    const ca = parseAddress({ ...base, country: 'CA', postalCode: 'K1A0B1' });
    expect(isInternational(us, ca)).toBe(true);
    expect(isInternational(us, us)).toBe(false);
  });

  test('AddressSchema rejects optional fields with wrong shape', () => {
    expect(() => AddressSchema.parse({ ...base, email: 'not-an-email' })).toThrow();
  });
});
