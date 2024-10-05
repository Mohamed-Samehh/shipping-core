# Historical release notes

This file collects long-form notes for releases prior to 0.4.0. The
machine-readable CHANGELOG.md remains the source of truth for short
descriptions; this file is the place to record retrospectives, lessons
learned and operational tips.

## 0.3.0 -- "Domain Day" (2025-02-28)

This release added the 43-entity domain layer that the rest of the
library composes on top of. Before this, only the lib helpers existed.

Highlights:

- **Single AuditService** -- after a few rounds of debate we settled on a
  single audit service that every service depends on. Initially each
  service had its own append-only repo for audit-style events; merging
  them into one stream made cross-entity timelines (e.g. "everything that
  happened to shipment X") trivially queryable.
- **Indexes inside MemoryStore** -- the index API moved from per-repo
  hand-rolled maps to a registered-accessor pattern. We rewrote 43
  repositories in a single pass; the tests caught two off-by-one errors
  in the original hand-rolled indexes.
- **Status enums** -- every status string is a `z.enum([...])` rather
  than a free-form `string`. This caught 4 places where the implementation
  used a status the schema didn't list.

Lessons:

- Resist the urge to merge "similar-looking" entities. `Manifest` and
  `Route` look similar from a distance but their lifecycles diverge. We
  briefly merged them and it cost a half-day to unwind.
- `RouteStop` proves the value of a junction entity over an inline array.
  Stops mutate frequently; an inline array would cause whole-route
  rewrites for every status update.

## 0.2.0 -- "Lib Foundation" (2024-12-20)

This release brought in the 60 lib helpers that the rest of the library
sits on. The aim was: every cross-cutting concern (clock, ids, money,
weight, validation, ...) should be testable in isolation and reusable
across services.

Highlights:

- `Money` and `Decimal` were the first additions; the rest of the lib
  was easier once these two existed.
- `Weight` / `Dimensions` / `dim-weight` were the third addition; before
  these existed the rate engine had number-soup all over it.
- `signature` / `jwt` / `email` / `phone` came in as a single PR; in
  retrospect that PR should have been split. We had to revert a phone
  parser change three weeks later because it broke a customer's existing
  E.164-formatted numbers.

Lessons:

- The cross-cutting helpers attract a lot of pull requests once they
  exist. Locking them down with extensive tests early paid off when the
  PR volume picked up.
- `lib/idempotency` is the only helper that took two rewrites. The first
  version did not check request-body fingerprint before returning a
  cached response, which made it dangerous in the face of retries with
  different bodies under the same key.

## 0.1.0 -- "Initial scaffold" (2024-10-04)

Project scaffold: `package.json`, `tsconfig`, eslint, prettier, jest,
Dockerfile, GitHub workflows.

Setting up the strict-mode `tsconfig` upfront caught a lot of category
errors before they ever became commits.

The Dockerfile pinned the Node base to `20.14.0-bookworm-slim` and we
have not changed it since; reproducibility is more valuable here than
keeping up with point releases.
