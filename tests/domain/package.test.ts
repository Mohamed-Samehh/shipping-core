import { parsePackage, packageVolumeMm3, packageLongestSide, packageGirth, packageLengthPlusGirth } from '../../src/domain/package';

const base = {
  id: 'pkg_1', shipmentId: 's1',
  lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000,
  isHazmat: false, isFragile: false, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Package schema', () => {
  test('parsePackage accepts a valid record', () => {
    expect(parsePackage(base).id).toBe('pkg_1');
  });

  test('rejects zero / negative dimensions', () => {
    expect(() => parsePackage({ ...base, lengthMm: 0 })).toThrow();
    expect(() => parsePackage({ ...base, weightG: -1 })).toThrow();
  });

  test('volume is l * w * h', () => {
    expect(packageVolumeMm3(parsePackage(base))).toBe(6_000_000);
  });

  test('longest side picks max', () => {
    expect(packageLongestSide(parsePackage(base))).toBe(300);
  });

  test('girth and lengthPlusGirth', () => {
    expect(packageGirth(parsePackage(base))).toBe(600);
    expect(packageLengthPlusGirth(parsePackage(base))).toBe(900);
  });

  test('rejects bad HS code shape', () => {
    expect(() => parsePackage({ ...base, hsCode: 'abc' })).toThrow();
  });
});
