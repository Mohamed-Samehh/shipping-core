// Cross-cutting error handler attached as the outermost middleware. Catches
// any error the inner stack throws and converts it to a JSON response.

import { ApiResponse } from './router';
import { ShippingError } from '../errors';
import { Logger } from '../lib/logger';

const STATUS_MAP: Array<[RegExp, number]> = [
  [/_NOT_FOUND$/, 404],
  [/_UNAUTHORIZED$/, 401],
  [/_FORBIDDEN$/, 403],
  [/_CONFLICT$/, 409],
  [/_TAKEN$/, 409],
  [/_RATE_LIMITED$/, 429],
  [/_RETURNED$/, 410],
  [/VALIDATION_FAILED$/, 400],
];

export function toResponse(error: unknown, logger?: Logger): ApiResponse {
  if (error instanceof ShippingError) {
    return {
      status: statusFor(error.code),
      body: { code: error.code, message: error.message, context: error.context },
    };
  }
  if (logger) {
    logger.error('unhandled error', { message: error instanceof Error ? error.message : String(error) });
  }
  return { status: 500, body: { code: 'INTERNAL_ERROR', message: 'internal server error' } };
}

export function statusFor(code: string): number {
  for (const [pattern, status] of STATUS_MAP) {
    if (pattern.test(code)) return status;
  }
  return 400;
}
