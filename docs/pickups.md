# Pickup requests

A pickup request asks a carrier to collect packages from a customer
location during a specified time window.

## Booking

```ts
const pickup = services.pickupRequestService.create({
  carrierId: 'c1', addressId: 'wh-1',
  requestedWindowStart: Date.parse('2025-04-21T10:00:00Z'),
  requestedWindowEnd:   Date.parse('2025-04-21T18:00:00Z'),
  actor: 'admin',
});
```

The carrier responds with a confirmation number; the pickup service
stores it on the request.

## Cut-offs

Each location has a `pickupCutoffLocal` (e.g. `17:00` in the location's
timezone). Pickups created after the cut-off are scheduled for the next
business day. The `lib/time.addBusinessDaysUtc()` helper handles
weekends and the optional holiday set.

## Linking shipments

Manifests link to a pickup via `Manifest.pickupRequestId`. The dispatcher
verifies that the manifest's `dispatchAt` is inside the pickup's
`requestedWindowStart..requestedWindowEnd`.

## Cancelling

`PickupRequestService.cancel()` is allowed up to the carrier's cut-off
(usually 60 minutes before the window start). Past that point, the
pickup must be marked `missed` instead.
