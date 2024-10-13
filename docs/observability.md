# Observability

shipping-core exposes hooks for metrics, tracing and audit logging:

- `lib/metrics` exposes counters, gauges and percentile histograms.
- `lib/tracing` exposes a `Tracer` interface every service can call.
- `lib/logger` is the level-gated structured logger.
- `AuditService` records observable state mutations.

The default implementations are in-memory and intended for tests; the
production wiring forwards them to OpenTelemetry / structured logs.
