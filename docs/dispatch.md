# Dispatch

Dispatch is the daily cadence of turning a backlog of booked shipments into
trucks leaving the warehouse.

## Daily timeline

```
   06:00 (local)   first label print
   ...
   16:30 (local)   pickup-cutoff warning -- 30 min before cutoff
   17:00 (local)   pickup cutoff -- manifests must be closed
   17:15 (local)   driver arrives, scans manifest
   18:00 (local)   truck leaves with all manifested shipments
```

The library exposes hooks at each step:

- `LocationService.pickupCutoffLocal` -- the local cutoff time.
- `ManifestService.dueForClose()` -- which manifests are within 30 min of
  their cutoff and still open.
- `DispatchSlot` -- pre-allocated capacity slots assigned to manifests.

## Capacity planning

Each `DispatchSlot` represents one truck-load slot at a (carrier, location,
time window) tuple. The slot tracks `capacity` (max shipments) and `booked`
(currently linked). The dispatcher rejects a manifest attach if the slot
is full.

The forecast service can pre-allocate slots based on historical demand.

## Routes vs manifests

`Manifest` represents one carrier handover -- "everything we're giving to
DHL on this dock at 17:15." `Route` represents a multi-stop run by *our*
driver -- "Van #4 will pickup three customer locations and deliver to two
distribution centres."

A `Route` may have many `Manifest`s along its stops; a `Manifest` belongs
to at most one `Route`.

## Driver assignment

Drivers are assigned to routes at planning time. A driver's licence is
checked against `Driver.licenseExpiresAt` before assignment -- an expired
licence rejects the assignment with `DRIVER_LICENCE_EXPIRED`.

## Vehicle assignment

Vehicle capacity (`capacityWeightG`, `capacityVolumeMm3`) is checked
against the route's `Sum(packages weight + volume)` before assignment.
