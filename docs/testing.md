# Testing

All tests run on top of `tests/fixtures.ts`, which wires the full service
stack with deterministic ids and a `FixedClock`.

```ts
import { buildFixture } from './fixtures';

const fixture = buildFixture();
const { services, clock } = fixture;

const shipment = services.shipmentService.create({
  customerId: 'cu_1',
  fromAddressId: 'addr_a',
  toAddressId: 'addr_b',
  actor: 'admin',
});

clock.advance(60_000); // step time forward for time-sensitive assertions
```

Each service test is isolated -- the fixture builds a fresh in-memory store
per test, so we don't share state between cases.
