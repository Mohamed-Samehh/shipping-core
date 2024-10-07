import { toResponse, statusFor } from '../../src/api/error-handler';
import { ShippingError } from '../../src/errors';

describe('error handler', () => {
  test('statusFor maps codes to common HTTP statuses', () => {
    expect(statusFor('SHIPMENT_NOT_FOUND')).toBe(404);
    expect(statusFor('AUTH_UNAUTHORIZED')).toBe(401);
    expect(statusFor('CARRIER_CONFLICT')).toBe(409);
    expect(statusFor('RATE_RATE_LIMITED')).toBe(429);
    expect(statusFor('VALIDATION_FAILED')).toBe(400);
  });

  test('toResponse wraps ShippingError', () => {
    const r = toResponse(new ShippingError('SHIPMENT_NOT_FOUND', 'gone', { id: 'x' }));
    expect(r.status).toBe(404);
    expect((r.body as { code: string }).code).toBe('SHIPMENT_NOT_FOUND');
  });

  test('toResponse returns 500 for unknown errors', () => {
    const r = toResponse(new Error('boom'));
    expect(r.status).toBe(500);
  });

  test('toResponse default 400 for unrecognised code', () => {
    expect(statusFor('UNKNOWN_CODE')).toBe(400);
  });

  test('toResponse logs unknown errors when logger supplied', () => {
    const logs: unknown[] = [];
    toResponse(new Error('boom'), { error: (m: string, f?: unknown) => { logs.push({ m, f }); }, debug: () => {}, info: () => {}, warn: () => {}, child: () => ({} as never) });
    expect(logs).toHaveLength(1);
  });
});
