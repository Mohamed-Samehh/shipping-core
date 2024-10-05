# Labels

A label is the carrier-issued artefact a parcel must carry on its journey.
shipping-core models labels via the `Label` entity and the
`LabelService`.

## Lifecycle

```
   shipment.rated
        |
        v
  label.issued        <- carrier returns PDF/ZPL/PNG bytes + tracking number
        |
   +--- void? ----> label.voided  (e.g. void within 60 min, before pickup)
   |
   +--- expire? --> label.expired (default 28 days after issue)
   |
   +--- print? ---> stays in 'issued'; physical print is out of scope
```

## Format

The label service supports PDF (most common), ZPL (for thermal printers)
and PNG (for inline previews). The bytes themselves are stored in object
storage; the entity carries the URL pointer only. This keeps the
repository small enough to ship inside the in-memory store.

## Voiding

A void must happen before the carrier scans the label into transit. Most
carriers enforce this on their side; shipping-core enforces it on ours
via the `Label.status === 'issued'` predicate. After void, the tracking
number is forever associated with the void; you cannot re-issue against
the same tracking number.

## Expiry

By default labels expire 28 days after issue
(`ShippingConfig.labelExpiryDays`). After expiry the label rejects
`print()` calls and the shipment must be re-rated and re-labelled.

## Idempotency

`LabelService.create()` accepts an optional idempotency key so retries on
flaky carrier APIs don't burn through tracking numbers.
