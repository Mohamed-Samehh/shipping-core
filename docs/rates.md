# Rate shopping

The rate-shopping flow turns a (origin, destination, packages) tuple into
a set of carrier rate quotes the caller can compare.

## Overview

```
Address(from) + Address(to) + Package[]
        |
        v
   RateRequest                         (persisted via RateRequestService)
        |
   fan out per carrier
        |
        v
   Rate[]   <- one per (carrier, service, account) tuple
```

Each rate carries:

- `amount` -- final billable amount (base + surcharges - discounts + tax).
- `baseAmount` -- pre-surcharge base.
- `surchargesAmount` -- sum of carrier and per-shipment surcharges.
- `discountAmount` -- sum of customer + contract discounts.
- `taxAmount` -- destination-country tax where applicable.
- `estimatedTransitDays` / `guaranteedBy` -- service-level promise.
- `expiresAt` -- past this timestamp the rate must be re-fetched.

## Picking a rate

The library does not pick *for* the caller. UIs typically expose two
selectors:

- **Cheapest**: lowest `amount` among rates whose `estimatedTransitDays`
  meets the buyer-requested deadline.
- **Fastest**: lowest `estimatedTransitDays` among rates whose `amount`
  is within the buyer's price ceiling.

## Caching

`RateService` does not cache by default. Production wrappers usually
front the carrier APIs with `lib/cache.TtlCache` keyed on the
(`fromAddressId`, `toAddressId`, package-hashes) tuple plus a short TTL.
The default cache window lives at `ShippingConfig.rateCacheTtlMs`.

## Failures

A carrier returning 5xx or a timeout *does not* fail the whole rate
request -- the dispatcher logs the failure to the audit log and continues
with the remaining carriers. The result set is whatever the surviving
carriers returned.
