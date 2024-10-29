// Canonical exception code lookup table. The tracking parser maps carrier
// codes onto these for cross-carrier reporting.

import { z } from '../lib/validate';

export const ExceptionCodeSchema = z.object({
  id: z.string().min(1),
  carrierId: z.string().min(1),
  carrierCode: z.string().min(1).max(40),
  category: z.string().min(1).max(40),
  description: z.string().min(1).max(200),
  retriable: z.boolean().default(false),
  metadata: z.record(z.string()).default({}),
});

export type ExceptionCode = z.infer<typeof ExceptionCodeSchema>;

export function parseExceptionCode(value: unknown): ExceptionCode {
  return ExceptionCodeSchema.parse(value);
}

export function isRetriable(code: ExceptionCode): boolean {
  return code.retriable;
}
