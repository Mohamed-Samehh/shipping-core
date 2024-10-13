# Changelog

All notable changes to `@helix/shipping-core` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project adheres to [Semantic Versioning](https://semver.org/).

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
