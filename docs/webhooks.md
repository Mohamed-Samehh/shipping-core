# Webhooks

shipping-core delivers outbound webhook events for every observable
shipment lifecycle change.

## Subscribing

Register a `WebhookEndpoint` via `WebhookEndpointService.create()` with:

- `url` -- where to POST events.
- `secret` -- shared secret used to sign the payload.
- `events` -- the event names to subscribe to (`'*'` for all).

## Delivery

The dispatcher enqueues a `WebhookDelivery` row per (endpoint, event) tuple.
Each attempt fires an HTTP POST with:

```
POST /your/webhook
Helix-Signature: t=1700000000,v1=<hex hmac>
Idempotency-Key: <delivery id>
Content-Type: application/json
```

The body is JSON. Use the `signature` helper to verify:

```ts
import { parseHeader, verify } from '@helix/shipping-core';

const header = parseHeader(req.headers['helix-signature']);
if (!header || !verify(rawBody, secret, header, 300, Date.now())) {
  return reply(401);
}
```

## Retries

A non-2xx response (or no response within 30 seconds) is a failure.
Failed deliveries retry with exponential backoff (see
`ShippingConfig.webhookRetryBackoffMs` and `lib/exp-backoff`).

After `webhookMaxRetries` (default 8), the delivery moves to `gave_up`.
The endpoint owner should investigate -- typically a stale endpoint URL
or a rotated secret.

## Supported events

| Event                       | When fired                              |
|-----------------------------|-----------------------------------------|
| `shipment.created`          | `ShipmentService.create()`              |
| `shipment.rated`            | First successful rate quote             |
| `shipment.booked`           | Carrier accepted the booking            |
| `shipment.manifested`       | Added to a closed manifest              |
| `shipment.in_transit`       | First in-transit tracking event         |
| `shipment.delivered`        | Carrier-reported delivery               |
| `shipment.exception`        | Carrier-reported exception              |
| `shipment.cancelled`        | Cancelled before manifest close         |
| `label.issued`              | Carrier issued the label                |
| `label.voided`              | Label voided                            |
| `manifest.closed`           | Manifest closed for dispatch            |
| `manifest.dispatched`       | Driver scanned manifest                 |
| `pickup.confirmed`          | Carrier confirmed pickup window         |
| `return.created`            | Customer-side return raised             |
