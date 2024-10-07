# Changelog

All notable changes to `@helix/shipping-core` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project adheres to [Semantic Versioning](https://semver.org/).

## 0.5.0 -- 2025-05-12

### Added

- `lib/transit-time` -- business-day delivery estimate with holiday
  support, `isOnTime` and `delayDays` helpers.
- `lib/carrier-rules` -- per-carrier weight / dimension / declared-value
  caps for UPS, FedEx, USPS and DHL.
- `lib/mail-class` -- USPS-style mail-class detection covering letter,
  flat, parcel, priority, priority-express, media and international.
- `lib/zone-lookup` -- carrier-style 1..9 zone lookup keyed by postal
  prefix.

### Added (docs)

- `docs/rates.md`, `docs/labels.md`, `docs/webhooks.md`,
  `docs/returns.md`, `docs/pickups.md`, `docs/dispatch.md`,
  `docs/audit-trail.md`, `docs/configuration.md`, `docs/glossary.md`,
  `docs/fixture-helper.md`, `docs/error-taxonomy.md`,
  `docs/versioning.md`, `docs/api-reference.md`,
  `docs/release-history.md`, `docs/performance.md`.
- Project policies: `CODE_OF_CONDUCT.md`, `SECURITY.md`.

### Added (tests)

- Domain-schema tests for `Address`, `Carrier`, `Shipment`, `Manifest`,
  `Package`, `Rate`, `TrackingEvent`, `WebhookDelivery`,
  `CustomsDeclaration`, `Discount`.
- Integration tests for customs flow, pickup flow, forecast snapshot,
  tag segmentation and hazmat declaration.

### Changed

- `auth.ts` -- error codes now end with `_UNAUTHORIZED` so the
  `error-handler` returns 401 (previously 400) for missing / invalid
  api keys.
- `tests/services/*` -- update assertions no longer assume `updatedAt`
  exists on every entity (some entities like `TrackingEvent`,
  `ManifestEntry`, `CustomsItem` are append-only).

### Internal

- `src/index.ts` barrel uses named re-exports for the modules whose
  default export sets overlap (`maths`, `range`, `template`, `compose`,
  `cron`, `dimensions`, `url-template`, `percentage`).

## 0.4.0 - 2025-04-15

### Added

- Full api layer with router, auth, idempotency middleware and integration
  test coverage.
- Public barrel `src/index.ts` covers every domain, repository, service and
  api module exported by the library.
- Integration tests for full shipment lifecycle, manifest dispatch, rate
  shopping, return flow and webhook retries.

### Changed

- Audit service is now constructed first in `buildFixture` so every other
  service receives the same recorder instance.

## 0.3.0 - 2025-02-28

### Added

- 43 domain entities covering carriers, services, accounts, shipments,
  packages, labels, manifests, tracking, customs, returns, pickups,
  webhooks, audit, notifications, forecasts and dispatch slots.
- In-memory repositories with secondary indexes for each entity.
- Per-entity service stack with audit hooks on every mutation.

## 0.2.0 - 2024-12-20

### Added

- Cross-cutting `lib/` utilities: result, assert, clock, id, hash, random,
  logger, cache, retry, rate-limit, signature, time, currency, decimal,
  money, percentage, concurrency, events, pagination, validate, sort,
  group, range, workflow, queue, csv, template, metrics, tracing,
  feature-flags, healthcheck, diff, url, idempotency, string, maths, ulid,
  cron, jwt, deferred, throttle, base64, env, safe-json, duration, iban,
  compose, async-iter, locale, luhn, email, phone, exp-backoff,
  url-template, prorate, recurrence.
- Shipping-specific helpers: weight, dimensions, dim-weight, postal-code,
  country, distance, hs-code, barcode.

## 0.1.0 - 2024-10-04

### Added

- Initial scaffold: package.json, tsconfig, license, contributing guide,
  README, Dockerfile, eslint + prettier + jest config, GitHub workflows
  and PR / issue templates.
- Domain-specific error taxonomy and process-wide config defaults.
