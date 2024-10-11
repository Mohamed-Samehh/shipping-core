import { readString, readInt, readBool, readEnum } from '../../src/lib/env';
import { ValidationError } from '../../src/errors';

const source = (env: Record<string, string | undefined>) => ({ env });

describe('env reader', () => {
  test('readString returns value when set', () => {
    expect(readString(source({ A: 'hi' }), 'A')).toBe('hi');
  });

  test('readString fallback when unset', () => {
    expect(readString(source({}), 'A', 'def')).toBe('def');
  });

  test('readString throws when required and unset', () => {
    expect(() => readString(source({}), 'A')).toThrow(ValidationError);
  });

  test('readInt parses integers', () => {
    expect(readInt(source({ N: '42' }), 'N')).toBe(42);
  });

  test('readInt rejects non-ints', () => {
    expect(() => readInt(source({ N: '4.5' }), 'N')).toThrow(ValidationError);
  });

  test('readBool maps common truthy values', () => {
    expect(readBool(source({ B: 'true' }), 'B')).toBe(true);
    expect(readBool(source({ B: '0' }), 'B')).toBe(false);
    expect(() => readBool(source({ B: 'maybe' }), 'B')).toThrow();
  });

  test('readEnum restricts to allowed set', () => {
    expect(readEnum(source({ E: 'a' }), 'E', ['a', 'b'] as const)).toBe('a');
    expect(() => readEnum(source({ E: 'c' }), 'E', ['a', 'b'] as const)).toThrow();
  });
});
