# Migration guide

Steps for upgrading between minor versions. Major versions are documented
separately when they ship.

## 0.4.x -> 0.5.0

### New lib helpers

`@helix/shipping-core` 0.5.0 adds four new lib helpers:

- `lib/transit-time` -- business-day delivery estimates.
- `lib/carrier-rules` -- per-carrier validation limits.
- `lib/mail-class` -- USPS-style mail class detection.
- `lib/zone-lookup` -- carrier-style zone lookup.

These are additive; you do not need to import them.

### Renamed exports in the public barrel

To resolve symbol collisions across the lib helpers, the following exports
are now namespaced when imported from the top-level barrel
(`@helix/shipping-core`):

| Original (via direct module import) | Top-level barrel name        |
|-------------------------------------|------------------------------|
| `lib/maths` `sum`, `clamp`          | `sumNumbers`, `clampNumber`  |
| `lib/range` `contains`, `clamp`, `size` | `rangeContains`, `clampRange`, `rangeSize` |
| `lib/template` `extractVariables`   | `extractTemplateVariables`   |
| `lib/cron` `nextAfter`, `matches`   | `nextCronAfter`, `matchesCron` |
| `lib/dimensions` `toUnit`           | `dimensionsToUnit`           |
| `lib/url-template` `extractVariables`, `expand` | `extractUrlTemplateVariables`, `expandUrlTemplate` |
| `lib/percentage` `discount`         | `discountBps`                |
| `lib/compose` `compose`             | `composeFns`                 |
| `lib/carrier-rules` `ValidationFailure` | `CarrierValidationFailure` |
| `lib/carrier-rules` `validate`, `isUsable` | `validateCarrierLimits`, `carrierIsUsable` |

Direct module imports (e.g. `import { sum } from '@helix/shipping-core/lib/money'`)
still resolve to the original names.

### Auth error code rename

`auth.AUTH_API_KEY_MISSING` and `auth.AUTH_API_KEY_INVALID` were
consolidated into `AUTH_API_KEY_UNAUTHORIZED` so the `error-handler`
returns 401 (was 400). Update any client-side mapping that switched on the
old codes.

### Updated assertion in service tests

Several entities (`TrackingEvent`, `ManifestEntry`, `CustomsItem`,
`Surcharge`, `Discount`, ...) are append-only or do not carry an
`updatedAt` field. The service-test template no longer asserts on
`next.updatedAt`. If you forked a test, port the assertion to
`expect(next.id).toBe(e.id)`.

## 0.3.x -> 0.4.0

### Public api surface

`@helix/shipping-core` 0.4.0 introduced the api layer (`src/api/`).
Production code that wired its own router on top of the services can now
use `createServer({ fixture, apiKeys })` directly. Existing code is
unaffected.

### Audit-service constructor parameter order

The audit service's parameter order moved from
`(clock, ids, repository)` to `(repository, clock, ids)` to align with
every other service. If you constructed `AuditService` by hand, update
the call site.

## 0.2.x -> 0.3.0

### Domain layer added

0.3.0 introduced the 43-entity domain layer. There is no migration; this
is purely additive.
