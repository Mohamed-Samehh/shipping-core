# Audit trail

Every observable state change in shipping-core is recorded as an
`AuditEvent` row. This file describes what we record, what we don't, and
how to query the trail.

## What is recorded

- Entity creation (`*.create`).
- Entity update (`*.update`) with before/after snapshots of the changed
  fields.
- Status transitions (`shipment.book`, `manifest.close`, `return.approve`,
  ...).
- Bulk operations expand to one event per affected entity.

## What is NOT recorded

- Read operations (`*.get`, `*.list`) -- the audit trail is for *mutations*.
- Internal recomputations (manifest total weight bump as entries are
  attached) -- these are derived state, not observable mutations.
- Tracking-event ingestion -- the tracking history *is* the audit trail
  for tracking, separately retained.

## Schema

```ts
interface AuditEvent {
  id: string;
  actor: string;             // who initiated -- 'api', 'cron', user id, ...
  action: string;            // 'shipment.update' / 'return.approve' / ...
  entityKind: string;        // 'shipment' / 'return' / ...
  entityId: string;
  customerId?: string;       // when known, makes per-customer audit faster
  shipmentId?: string;       // when known
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata: Record<string, string>;
  recordedAt: number;        // ms since epoch
}
```

## Querying

The service exposes the most common lookups via methods:

```ts
const audit = fixture.services.auditService;

audit.listForEntity('shp_42');     // every event for one entity
audit.listForCustomer('cu_1');     // every event scoped to one customer
audit.countByAction('shipment.book');
```

For ad-hoc queries, `audit.repository.list({ filter })` returns a paginated
slice with arbitrary predicate.

## Retention

Audit events are append-only and never modified. Production deployments
back up the audit-event repository to a cold store and prune in-memory
rows older than 90 days.
