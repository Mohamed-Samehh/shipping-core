# Troubleshooting

Symptom-driven reference for operators running shipping-core in
production. Each entry pairs the symptom with the most likely cause and
the action that resolves it.

## Rate-request returns an empty array

**Symptom:** `RateService.list().filter(r => r.shipmentId === id)` is
empty even though `rateRequestService.create()` succeeded.

**Likely cause:** every carrier API call timed out or returned 5xx, and
the dispatcher logged the failures to the audit log but produced no
`Rate` rows.

**Fix:** inspect the audit log for the rate-request id; entries with
action `carrier.rate.failed` carry the upstream error code. If every
carrier failed, escalate to the carrier integration team. If only some
failed, the surviving rates may simply be insufficient (e.g. all
upgrades to express because ground was unavailable).

## Label issue throws `LabelExpiredError`

**Symptom:** booking a previously-rated shipment throws
`LabelExpiredError: LABEL_EXPIRED`.

**Likely cause:** the rate the booking selected has passed its
`expiresAt`. Carriers refuse to issue labels against expired rates.

**Fix:** re-rate before booking. The UI should display the rate's
`expiresAt` and pre-fetch fresh rates before the deadline.

## Manifest can't be closed

**Symptom:** `ManifestService.update({status: 'closed'})` throws
`MANIFEST_CLOSED` or `WORKFLOW_INVALID_TRANSITION`.

**Likely cause:** the manifest is already in a terminal state
(`closed` / `dispatched` / `cancelled`).

**Fix:** check `manifest.status` before attempting to close. If the
caller meant to *update* a closed manifest, that operation is not
supported -- create a new manifest instead.

## Tracking events arrive out of order

**Symptom:** a `delivered` tracking event arrives, then a later
`in_transit` event shows up with the same `recordedAt` but earlier
`occurredAt`.

**Likely cause:** carrier webhook delivery does not guarantee order. The
tracking layer is intentionally append-only and uses `occurredAt` to
decide the surface status.

**Fix:** none required at the library level. The latest visible status
is whichever event has the most recent `occurredAt`. If the customer-
facing status flickers, debounce in the UI layer.

## Webhook delivery stuck in `pending`

**Symptom:** `WebhookDelivery.status === 'pending'` for hours; no
`deliveredAt` timestamp.

**Likely cause:** the receiver returned 5xx repeatedly and the retry
scheduler is between attempts (exponential backoff).

**Fix:** inspect `lastResponseStatus` and `lastResponseBody`. If the
receiver is permanently broken, the delivery transitions to `gave_up`
after `webhookMaxRetries` retries. If the receiver was temporarily
down and is now recovered, the next scheduled retry should succeed.

## `WebhookSignatureError` from receiver

**Symptom:** receiver logs `WebhookSignatureError: WEBHOOK_SIGNATURE_*`.

**Likely cause:** secret rotation; the receiver still holds the old
secret while shipping-core signs with the new one.

**Fix:** update the receiver to verify against the **set** of valid
secrets during the rotation window (~24h). After the window closes,
trim the receiver back to just the new secret.

## Idempotency conflict on retry

**Symptom:** a retry of an api call throws
`IdempotencyConflictError: IDEMPOTENCY_MISMATCH`.

**Likely cause:** the client sent the same `Idempotency-Key` header
with a different request body.

**Fix:** generate a fresh key per logical operation. The same key MUST
carry the same body fingerprint across retries.

## Customs declaration rejected as "incomplete"

**Symptom:** carrier returns `CUSTOMS_REQUIRED` when booking an
international shipment.

**Likely cause:** the `CustomsDeclaration` exists but has zero
`CustomsItem` rows -- the carrier needs at least one line.

**Fix:** ensure your booking flow waits for items to be attached
before triggering the rate / book call. The `customs-flow.test.ts`
integration test shows the expected wiring.

## Pickup window mismatch with manifest

**Symptom:** `ManifestService.dispatch()` throws
`WORKFLOW_INVALID_DISPATCH_TIME`.

**Likely cause:** the manifest's `dispatchAt` falls outside the
linked pickup request's `requestedWindowStart..requestedWindowEnd`.

**Fix:** dispatch *within* the pickup window. If the window has
already closed, mark the pickup `missed` and book a fresh one.

## Audit log grows unbounded

**Symptom:** in-memory repository sizes increase monotonically until
the process OOMs.

**Likely cause:** the default repositories are in-memory and don't
prune. Production deployments must back the repos with a real store
that enforces retention.

**Fix:** see `docs/persistence.md` for the swap pattern.

## Test fails with `clock.now() is not a function`

**Symptom:** a service test instantiated outside `buildFixture()`
fails with this error.

**Likely cause:** the service was constructed with `Date.now` instead
of a `Clock` instance.

**Fix:** always wire via `buildFixture()` so the clock dependency is
threaded uniformly. If you need a service in isolation, instantiate a
`FixedClock` explicitly.

## Tracking poll exceeds carrier quota

**Symptom:** the tracking poller logs HTTP 429 from one or more
carriers.

**Likely cause:** `ShippingConfig.trackingPollIntervalSec` is set
lower than the carrier-side quota allows.

**Fix:** bump the poll interval, or front the poll with
`TokenBucketLimiter` keyed by carrier id. The `lib/rate-limit`
helpers are designed for this case.
