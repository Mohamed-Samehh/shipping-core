import {
  assert, assertString, assertNonEmpty, assertInt, assertNonNegativeInt,
  assertPositiveInt, assertInRange, assertFinite, assertOneOf,
} from '../../src/lib/assert';
import { ValidationError } from '../../src/errors';

describe('assert helpers', () => {
  test('assert throws ValidationError on falsy', () => {
    expect(() => assert(false, 'X', 'm')).toThrow(ValidationError);
    expect(() => assert(true, 'X', 'm')).not.toThrow();
  });

  test('assertString rejects non-string', () => {
    expect(() => assertString(1 as unknown, 'X', 'n')).toThrow(ValidationError);
    expect(() => assertString('hi', 'X', 'n')).not.toThrow();
  });

  test('assertNonEmpty rejects empty string', () => {
    expect(() => assertNonEmpty('', 'X', 'n')).toThrow(ValidationError);
    expect(() => assertNonEmpty('a', 'X', 'n')).not.toThrow();
  });

  test('assertInt rejects floats and non-numbers', () => {
    expect(() => assertInt(1.5, 'X', 'n')).toThrow(ValidationError);
    expect(() => assertInt('1' as unknown, 'X', 'n')).toThrow(ValidationError);
    expect(() => assertInt(2, 'X', 'n')).not.toThrow();
  });

  test('assertNonNegativeInt rejects negatives', () => {
    expect(() => assertNonNegativeInt(-1, 'X', 'n')).toThrow(ValidationError);
    expect(() => assertNonNegativeInt(0, 'X', 'n')).not.toThrow();
  });

  test('assertPositiveInt rejects zero and negatives', () => {
    expect(() => assertPositiveInt(0, 'X', 'n')).toThrow(ValidationError);
    expect(() => assertPositiveInt(5, 'X', 'n')).not.toThrow();
  });

  test('assertInRange enforces bounds inclusive', () => {
    expect(() => assertInRange(2, 0, 10, 'X', 'n')).not.toThrow();
    expect(() => assertInRange(-1, 0, 10, 'X', 'n')).toThrow();
    expect(() => assertInRange(11, 0, 10, 'X', 'n')).toThrow();
  });

  test('assertFinite rejects NaN and Infinity', () => {
    expect(() => assertFinite(Infinity, 'X', 'n')).toThrow();
    expect(() => assertFinite(NaN, 'X', 'n')).toThrow();
    expect(() => assertFinite(1, 'X', 'n')).not.toThrow();
  });

  test('assertOneOf narrows to literal', () => {
    expect(() => assertOneOf('a', ['a', 'b'] as const, 'X', 'n')).not.toThrow();
    expect(() => assertOneOf('c', ['a', 'b'] as const, 'X', 'n')).toThrow();
  });
});
