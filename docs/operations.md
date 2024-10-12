# Operations Playbook

## Dispatch cut-offs

Every location has a `pickupCutoffLocal` time. Shipments booked after the
cut-off roll to the next business day. The manifest service exposes
`dueForClose()` to surface manifests that have exceeded the auto-close
window without being dispatched.

## Tracking poll quotas

The tracking poller uses the `lib/rate-limit` token bucket to stay inside
carrier-side quotas. The default is 600 calls / min per carrier; tune via
the `rateCacheTtlMs` option.

## Webhook backoff

Failed deliveries retry up to `webhookMaxRetries` (default 8) with the
backoff schedule from `lib/exp-backoff`. After the last attempt, the
delivery transitions to `gave_up` and the operator should investigate.
