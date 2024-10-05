# Fixture helper

Tests in shipping-core wire the full service stack via `tests/fixtures.ts`,
which exposes `buildFixture()`.

## What buildFixture builds

`buildFixture(initialMs?)` constructs:

- A fresh `FixedClock`, optionally seeded with an ISO timestamp string.
- A fresh `CounterIdGenerator` using `'id'` as the default prefix.
- One `AuditEventRepository` + `AuditService`.
- One repository per entity (43 in total).
- One service per repository, with the audit service threaded in.

It returns:

```ts
interface Fixture {
  clock: FixedClock;
  ids: CounterIdGenerator;
  repositories: { ... };
  services: { ... };
  auditService: AuditService;
}
```

## Usage

```ts
import { buildFixture } from './fixtures';

const fixture = buildFixture();
const { services, clock } = fixture;

const customer = services.customerService.create({
  name: 'Ana', email: 'a@b.com', defaultCurrency: 'USD', actor: 'admin',
});

clock.advance(60 * 1000); // step the clock for time-sensitive tests
```

## Isolation

Each call to `buildFixture()` creates fresh state. Tests should call it
inside `beforeEach` (or once per test if state should not leak between
test cases).

## Real-time vs fake-time

The fixture's clock is a `FixedClock` -- nothing real happens with time
until you call `clock.advance(ms)` or `clock.set(value)`. This means:

- `Date.now()` calls inside library code do not see the clock (only code
  that takes the clock as a dependency does).
- Jest's `jest.useFakeTimers()` is not required for shipping-core tests.

## Adding a new entity to the fixture

When you add a new domain + repository + service trio, add it to
`SERVICE_SPECS` in the build generator and regenerate `fixtures.ts`. The
generator wires the repository and service with the shared clock / ids /
audit service automatically.
