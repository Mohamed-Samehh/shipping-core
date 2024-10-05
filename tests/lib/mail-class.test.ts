import { detectMailClass, maxWeightFor } from '../../src/lib/mail-class';
import { dimensions } from '../../src/lib/dimensions';
import { weight } from '../../src/lib/weight';

describe('mail-class', () => {
  test('first-class letter for small light', () => {
    expect(detectMailClass(dimensions(280, 100, 5, 'mm'), weight(50, 'g'),
      { isInternational: false })).toBe('first-class-letter');
  });

  test('first-class flat for slightly heavier', () => {
    expect(detectMailClass(dimensions(350, 200, 5, 'mm'), weight(300, 'g'),
      { isInternational: false })).toBe('first-class-flat');
  });

  test('first-class parcel for under 6kg', () => {
    expect(detectMailClass(dimensions(300, 200, 100, 'mm'), weight(5, 'kg'),
      { isInternational: false })).toBe('first-class-parcel');
  });

  test('priority mail for under 31.75kg', () => {
    expect(detectMailClass(dimensions(300, 200, 100, 'mm'), weight(20, 'kg'),
      { isInternational: false })).toBe('priority-mail');
  });

  test('international-priority overrides for international', () => {
    expect(detectMailClass(dimensions(300, 200, 100, 'mm'), weight(1, 'kg'),
      { isInternational: true })).toBe('international-priority');
  });

  test('media-mail when flag set', () => {
    expect(detectMailClass(dimensions(300, 200, 100, 'mm'), weight(1, 'kg'),
      { isInternational: false, isMedia: true })).toBe('media-mail');
  });

  test('preferExpress upgrades to express', () => {
    expect(detectMailClass(dimensions(300, 200, 100, 'mm'), weight(1, 'kg'),
      { isInternational: false, preferExpress: true })).toBe('priority-mail-express');
  });

  test('maxWeightFor returns sane defaults', () => {
    expect(maxWeightFor('first-class-letter')).toBe(100);
    expect(maxWeightFor('priority-mail')).toBe(31_750);
  });
});
