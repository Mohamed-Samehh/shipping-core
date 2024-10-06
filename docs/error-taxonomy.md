# Error taxonomy

shipping-core uses a single error hierarchy rooted at `ShippingError`.
Every service throws a subclass; callers can `instanceof ShippingError` or
use `isShippingError(value)` from the public barrel.

## Subclasses

| Subclass | Common code prefix | Maps to HTTP |
|----------|--------------------|--------------|
| `NotFoundError`              | `*_NOT_FOUND`         | 404 |
| `ConflictError`              | `*_CONFLICT`, `*_TAKEN` | 409 |
| `PreconditionFailedError`    | `*_PRECONDITION_FAILED` | 412 |
| `UnauthorizedError`          | `*_UNAUTHORIZED`      | 401 |
| `ForbiddenError`             | `*_FORBIDDEN`         | 403 |
| `RateLimitedError`           | `*_RATE_LIMITED`      | 429 |
| `IntegrityError`             | `*_INTEGRITY_*`       | 500 |
| `ValidationError`            | `VALIDATION_FAILED`   | 400 |
| `CurrencyMismatchError`      | `CURRENCY_MISMATCH`   | 400 |
| `WeightOverflowError`        | `WEIGHT_*`            | 400 |
| `DimensionOverflowError`     | `DIMENSION_*`         | 400 |
| `HazmatViolationError`       | `HAZMAT_*`            | 400 |
| `CustomsRequiredError`       | `CUSTOMS_*`           | 400 |
| `CarrierUnavailableError`    | `CARRIER_UNAVAILABLE` | 502 |
| `ServiceLevelInvalidError`   | `SERVICE_LEVEL_*`     | 400 |
| `ManifestClosedError`        | `MANIFEST_CLOSED`     | 409 |
| `TrackingNotIssuedError`     | `TRACKING_NOT_ISSUED` | 412 |
| `LabelExpiredError`          | `LABEL_EXPIRED`       | 410 |
| `ReturnNotAllowedError`      | `RETURN_NOT_ALLOWED`  | 409 |
| `WorkflowError`              | `WORKFLOW_*`          | 409 |
| `IdempotencyConflictError`   | `IDEMPOTENCY_MISMATCH`| 409 |
| `WebhookSignatureError`      | `WEBHOOK_SIGNATURE_*` | 401 |
| `GatewayError`               | `GATEWAY_*`           | 502 |

## Context

Every error carries an optional `context` object alongside the message.
The context shape is error-specific but typically includes:

- The id of the affected entity.
- The user-supplied parameter that triggered the error.
- For conflicts, the conflicting value (e.g. `email`, `externalRef`).

The api `error-handler` includes the context in the JSON body so clients
can react programmatically.

## Logging

Production loggers are recommended to log:

- `code` (always).
- `message` (always).
- `context` (always).
- Stack trace for `GatewayError`, `IntegrityError`, and any non-
  `ShippingError` (5xx-class).

Do NOT log the `context` body of `IdempotencyConflictError` -- it contains
the request fingerprint which may include PII.
