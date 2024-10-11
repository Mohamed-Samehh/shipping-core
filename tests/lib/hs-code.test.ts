import { isValidHsCode, describeHsCode, chapter, heading, listKnown } from '../../src/lib/hs-code';

describe('hs-code', () => {
  test('valid 6-10 digit codes', () => {
    expect(isValidHsCode('610910')).toBe(true);
    expect(isValidHsCode('6109100000')).toBe(true);
    expect(isValidHsCode('61091')).toBe(false);
    expect(isValidHsCode('abc')).toBe(false);
  });

  test('describe returns metadata when known', () => {
    expect(describeHsCode('610910')?.chapter).toBe('61');
  });

  test('chapter / heading extract prefix', () => {
    expect(chapter('610910')).toBe('61');
    expect(heading('610910')).toBe('6109');
  });

  test('listKnown is non-empty', () => {
    expect(listKnown().length).toBeGreaterThan(0);
  });

  test('describe returns undefined for unknown', () => {
    expect(describeHsCode('999999')).toBeUndefined();
  });
});
