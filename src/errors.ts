// Domain-specific error taxonomy for @helix/shipping-core. Every error carries
// a stable machine-readable `code` plus an optional `context` bag for logs.
// Service code only throws subclasses; callers can `instanceof ShippingError`
// or use the `isShippingError` guard to safely surface failures.

export class ShippingError extends Error {
  readonly code: string;
  readonly context?: Record<string, unknown>;

  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (context) this.context = context;
  }
}

export class NotFoundError extends ShippingError {}
export class ConflictError extends ShippingError {}
export class PreconditionFailedError extends ShippingError {}
export class UnauthorizedError extends ShippingError {}
export class ForbiddenError extends ShippingError {}
export class RateLimitedError extends ShippingError {}
export class IntegrityError extends ShippingError {}
export class ValidationError extends ShippingError {}
export class CurrencyMismatchError extends ShippingError {}
export class WeightOverflowError extends ShippingError {}
export class DimensionOverflowError extends ShippingError {}
export class HazmatViolationError extends ShippingError {}
export class CustomsRequiredError extends ShippingError {}
export class CarrierUnavailableError extends ShippingError {}
export class ServiceLevelInvalidError extends ShippingError {}
export class ManifestClosedError extends ShippingError {}
export class TrackingNotIssuedError extends ShippingError {}
export class LabelExpiredError extends ShippingError {}
export class ReturnNotAllowedError extends ShippingError {}
export class WorkflowError extends ShippingError {}
export class IdempotencyConflictError extends ShippingError {}
export class WebhookSignatureError extends ShippingError {}
export class GatewayError extends ShippingError {}

export function isShippingError(value: unknown): value is ShippingError {
  return value instanceof ShippingError;
}
