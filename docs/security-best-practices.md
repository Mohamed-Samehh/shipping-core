# Security best practices

Production deployments of `@helix/shipping-core` should follow the
practices below to keep tracking numbers, webhook secrets and customer
data safe.

## Webhook signatures

Always use the `signature` helpers (`sign`, `verify`) for outbound
webhooks. The helpers use `timingSafeEqual` to avoid timing-side-channel
leaks of the secret.

Rotate webhook secrets quarterly. The endpoint update flow accepts the
new secret while still accepting incoming signatures verified with the
old secret for a configurable overlap window (default 24h).

## API keys

API keys live in `StaticApiKeyLookup` only in tests. Production
deployments wire a database-backed lookup. Keys should be:

- High entropy (32+ random bytes).
- Hashed at rest (sha256, no salt -- the lookup is constant-time).
- Bound to a single customer and a single environment (sandbox / prod).
- Revocable; revocation should propagate within 60 seconds.

The `error-handler` returns 401 for missing / invalid keys -- never 404
(would leak existence of the endpoint).

## Idempotency keys

Idempotency keys may contain customer-identifying information. Do NOT
log the raw key in production. The `lib/idempotency` store fingerprints
the request body before storing, but the key itself is stored verbatim
for lookup.

## PII redaction

The audit log captures before / after snapshots of mutating operations.
Some entities carry PII (recipient name, address, email). Production
deployments should:

- Pipe audit events through a redaction filter before durably persisting.
- Mask `name`, `email`, `phone`, `street1`, `street2`, `postalCode`
  fields by default.
- Keep raw audit events in memory only for the most recent 24 hours.

## Hazmat declarations

`HazmatDeclaration` records carry `signedBy`. The signer's identity is
captured for compliance audits. Do NOT delete hazmat declarations
without going through the compliance-retention flow -- regulators may
request them up to 7 years after shipment.

## Customs data

`CustomsDeclaration` and `CustomsItem` carry buyer-side PII and product
descriptions that may be commercially sensitive. They should be:

- Encrypted at rest.
- Accessible only to roles `customs.read` and `customs.write`.
- Logged when accessed (read events go through the audit log).

## Rate limits

The api layer should be fronted by a rate limiter. The `lib/rate-limit`
helpers (`TokenBucketLimiter`, `FixedWindowLimiter`) are designed to be
embedded in middleware before the auth check.

Recommended default: 100 requests per minute per api key. Production
deployments tune this per-customer based on the contracted volume.

## Dependency hygiene

Run `npm audit` weekly in CI. shipping-core has a single runtime
dependency (`zod`); test-time dependencies are kept patched on each
release.
