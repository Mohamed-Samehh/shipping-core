// Thin adapter over zod that converts schema failures into a structured
// `ValidationError` carrying the field-level issues.

import { z, ZodIssue, ZodSchema, ZodTypeAny } from 'zod';
import { ValidationError } from '../errors';
import { Result, err, ok } from './result';

export type Schema<T> = ZodSchema<T>;

export interface FieldIssue {
  readonly path: string;
  readonly message: string;
  readonly code: string;
}

export interface ValidationFailure {
  readonly issues: readonly FieldIssue[];
}

export function parse<S extends ZodTypeAny>(schema: S, value: unknown,
  context = 'value'): z.infer<S> {
  const result = schema.safeParse(value);
  if (result.success) return result.data as z.infer<S>;
  throw new ValidationError('VALIDATION_FAILED', `${context} failed validation`, {
    issues: result.error.issues.map(toFieldIssue),
  });
}

export function safeParse<S extends ZodTypeAny>(schema: S,
  value: unknown): Result<z.infer<S>, ValidationFailure> {
  const result = schema.safeParse(value);
  if (result.success) return ok(result.data as z.infer<S>);
  return err({ issues: result.error.issues.map(toFieldIssue) });
}

export function toFieldIssue(issue: ZodIssue): FieldIssue {
  return { path: issue.path.join('.'), message: issue.message, code: issue.code };
}

export { z };
export type { ZodTypeAny };
