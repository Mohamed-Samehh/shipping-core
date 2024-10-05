# Glossary

A reference for shipping terminology as it is used inside shipping-core.

## Account

A carrier-side customer record. A single customer (Helix-side) can hold
multiple carrier accounts -- one with FedEx, one with UPS, etc. The
account decides which carrier-side billing identity gets charged for a
shipment.

## Billable weight

`max(actualWeight, dimensionalWeight)`. Carriers charge by whichever is
larger. See [dim-weight](dim-weight.md).

## Booking

The carrier-side acceptance that turns a rated shipment into a real
shipment with a tracking number.

## Carrier

The entity that moves the parcel (UPS, FedEx, USPS, etc.). Modelled by
`Carrier`.

## Dispatch

The act of turning a closed manifest into a truck handover. After
dispatch, the manifest is locked.

## Dimensional weight

Volume / dim-factor. Often labelled "dim weight" or "volumetric weight".

## Girth

`2 * (width + height)`. Used in combination with length to compute the
parcel's "length + girth" total that carriers limit.

## Hazmat

Hazardous material -- a parcel containing any of the IATA / DOT
regulated categories. Requires a `HazmatDeclaration` and may not be
accepted by all carriers.

## Incoterm

International commercial term defining who pays customs duty,
insurance, and shipping. `DAP`, `DDP`, `EXW`, `FCA`, ... See
[customs.md](customs.md).

## Label

The physical sticker on the parcel showing tracking number, address and
service. Stored as `Label` with bytes in object storage.

## Manifest

The end-of-day handover document listing every shipment going out on a
particular pickup wave.

## Pickup request

A scheduled visit by the carrier (or the customer's own dispatcher) to
collect parcels.

## POD

Proof of delivery. Carrier-issued evidence that the parcel arrived,
optionally with a signature image and a photo.

## Rate

A quote for shipping one specific shipment via one specific (carrier,
service, account) tuple. Rates expire.

## SSCC

Serial Shipping Container Code. 18-digit barcode used on manifests and
parcels for cross-carrier identification. See `lib/barcode`.

## Surcharge

A per-shipment additional charge on top of the base rate (fuel,
residential, peak season, hazmat, ...).

## Tracking number

The carrier-issued identifier for one specific package. Globally unique
within a carrier.

## Tracking event

One snapshot of where a parcel is at a point in time. Append-only;
ordered by `occurredAt`.

## Zone

Carrier-side bucket grouping origin / destination postal prefix pairs
for rating purposes.
