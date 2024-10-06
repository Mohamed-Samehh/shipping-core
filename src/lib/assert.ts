// Runtime assertions for arguments. Each helper throws a `ValidationError`
// from the shared error taxonomy so callers get a uniform `code` + `context`
// payload across every domain.

import { ValidationError } from '../errors';

export function assert(condition: unknown, code: string, message: string,
  context?: Record<string, unknown>): asserts condition {
  if (!condition) {
    throw new ValidationError(code, message, context);
  }
}

export function assertString(value: unknown, code: string, name: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(code, `${name} must be a string`, { name, got: typeof value });
  }
}

export function assertNonEmpty(value: string, code: string, name: string): void {
  if (value.length === 0) {
    throw new ValidationError(code, `${name} must not be empty`, { name });
  }
}

export function assertInt(value: unknown, code: string, name: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(code, `${name} must be an integer`, { name, got: value });
  }
}

export function assertNonNegativeInt(value: unknown, code: string, name: string):
  asserts value is number {
  assertInt(value, code, name);
  if (value < 0) {
    throw new ValidationError(code, `${name} must be non-negative`, { name, value });
  }
}

export function assertPositiveInt(value: unknown, code: string, name: string):
  asserts value is number {
  assertInt(value, code, name);
  if (value <= 0) {
    throw new ValidationError(code, `${name} must be positive`, { name, value });
  }
}

export function assertInRange(value: number, min: number, max: number, code: string, name: string): void {
  if (value < min || value > max) {
    throw new ValidationError(code, `${name} out of range [${min}, ${max}]`, {
      name, value, min, max,
    });
  }
}

export function assertFinite(value: number, code: string, name: string): void {
  if (!Number.isFinite(value)) {
    throw new ValidationError(code, `${name} must be finite`, { name, value });
  }
}

export function assertOneOf<T extends string>(value: string, allowed: readonly T[], code: string,
  name: string): asserts value is T {
  if (!(allowed as readonly string[]).includes(value)) {
    throw new ValidationError(code, `${name} must be one of ${allowed.join(', ')}`, {
      name, value, allowed,
    });
  }
}
