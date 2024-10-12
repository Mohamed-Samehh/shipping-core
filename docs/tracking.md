# Tracking ingestion

Tracking events are append-only. The latest visible status is decided by
`occurredAt`, not by overwriting earlier rows. This keeps the audit trail
honest -- if a carrier delivers an out-of-order update, the older event is
still recorded but the surface status reflects whichever event is most
recent.

## Status mapping

The library exposes a canonical `TrackingStatus` enum. Carrier-specific
codes are mapped onto these via the `ExceptionCode` table for exceptions
and via a per-carrier translator in `services/tracking-service.ts`.

## Polling vs webhook

Most modern carriers push tracking updates via webhook. For carriers that
do not, the `services/tracking-poll-service.ts` runs a scheduled poll at
the interval configured by `trackingPollIntervalSec`.
