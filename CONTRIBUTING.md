# Contributing

`@helix/shipping-core` is part of the internal fulfilment stack. Treat it as
a shared library — backwards-incompatible API changes require a deprecation
notice and a minor-version bump on the consumer side first.

## Branches

- `main` — release-ready.
- `feature/<scope>-<what>` — net-new functionality.
- `fix/<scope>-<what>` — bug fixes.
- `chore/<scope>-<what>` — internal refactor, tooling, docs.

Open pull requests against `main`. Squash-merge once approved.

## Local checks

Before pushing, run:

```sh
npm install
npm run typecheck
npm run lint
npm test
```

CI runs the same three commands against Node 20.14.0 on Ubuntu 22.04.

## Commit messages

Use Conventional Commits with one of the scopes listed below.

```
<type>(<scope>): <short imperative summary>
```

Common scopes: `lib`, `domain`, `repo`, `carriers`, `services`, `shipments`,
`labels`, `manifests`, `tracking`, `customs`, `returns`, `pickup`, `webhooks`,
`api`, `docs`, `test`.

## Schema changes

Every entity has a zod schema. Whenever you add a field:

1. Add it to the schema with a sensible default if the field is optional.
2. Update the corresponding repository's secondary indexes if the new field
   is queryable.
3. Add or extend tests under `tests/domain/<entity>.test.ts`.
4. Bump the package version per semver (minor for additive, major for
   breaking — but breaking changes are rarely the right answer; prefer a
   new optional field with a sensible default).

## Service layer rules

- Services own writes against repositories. Repositories should never be
  written to directly from the API layer.
- Currency math goes through `Money` and `lib/money` — never plain numbers.
- Every observable status change should write an `AuditEvent` via the
  `AuditService`. Internal mechanical mutations (recomputing manifest
  totals, append-only tracking writes) are excluded.
- Stateful side effects (label print, manifest close, webhook dispatch)
  accept an optional idempotency key. Use `lib/idempotency` for client-supplied
  keys.

## Test layout

- `tests/lib/*` covers individual helpers in isolation.
- `tests/domain/*` covers schemas and predicates.
- `tests/repositories/*` covers index maintenance and view helpers.
- `tests/services/*` exercises the full service stack via `buildFixture`.
- `tests/api/*` covers router, middleware and route integration.

Tests use a `FixedClock` and a deterministic `CounterIdGenerator`; no real
time, no real randomness, no real network.
