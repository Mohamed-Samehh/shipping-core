# Configuration

shipping-core exposes a single `ShippingConfig` record consumed by every
service that needs operational knobs. The defaults under `DEFAULT_CONFIG`
are tuned for tests and small deployments; production overrides them
explicitly.

## Fields

| Field | Default | Description |
|-------|---------|-------------|
| `defaultCurrency`           | `'USD'`        | Currency used when an entity does not specify one. |
| `defaultWeightUnit`         | `'kg'`         | Display unit when formatting weight for humans. |
| `defaultDimensionUnit`      | `'cm'`         | Display unit when formatting dimensions. |
| `defaultDimFactor`          | `5000`         | Carrier-style dim factor used as fallback. |
| `maxParcelWeightKg`         | `70`           | Hard limit. Parcels exceeding this are freight. |
| `maxParcelLongestSideCm`    | `274`          | UPS / FedEx upper limit. |
| `maxParcelGirthCm`          | `419`          | UPS / FedEx upper limit on (L + 2W + 2H). |
| `maxParcelsPerShipment`     | `99`           | API-level cap before paging. |
| `manifestAutoCloseHours`    | `24`           | After this many hours an open manifest auto-closes. |
| `labelExpiryDays`           | `28`           | Default label expiry after issue. |
| `trackingPollIntervalSec`   | `900`          | Default poll cadence for carriers without webhook. |
| `webhookMaxRetries`         | `8`            | Max deliveries per webhook event. |
| `webhookRetryBackoffMs`     | `30_000`       | Base backoff between retries. |
| `rateCacheTtlMs`            | `300_000`      | Rate cache window. |

## Overriding

```ts
import { DEFAULT_CONFIG, mergeConfig } from '@helix/shipping-core';

const config = mergeConfig({
  maxParcelWeightKg: 30,        // tighter limit per customer agreement
  webhookMaxRetries: 12,        // give shaky integrators more breathing room
});
```

## Per-customer overrides

The default config is process-wide. Per-customer overrides live on the
`Contract` entity -- the rate engine reads contract-level discounts and
maximum-weight overrides before falling back to `ShippingConfig`.
