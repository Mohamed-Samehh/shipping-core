# Security Policy

## Supported versions

We backport security fixes to the latest minor release.

| Version | Status      |
|---------|-------------|
| 0.4.x   | Active      |
| 0.3.x   | Maintenance |
| < 0.3   | Unsupported |

## Reporting a vulnerability

Please email `security@helix.example` with:

- A description of the issue
- Reproduction steps (proof-of-concept welcome)
- Affected versions
- Your preferred contact for follow-up

We acknowledge reports within 2 business days and aim to ship a fix within
14 days for critical issues.

## Out-of-scope

- Findings against the in-memory persistence stack (intentionally
  ephemeral; not used in production).
- Dependency vulnerabilities reported by `npm audit` without a working
  exploit against shipping-core itself.
- Issues found in the example fixture data.

## Hardened areas

The following areas are intentionally hardened beyond the rest of the
library:

- `src/lib/signature.ts` -- HMAC verification uses `timingSafeEqual`.
- `src/lib/jwt.ts` -- HS256 verification uses `timingSafeEqual`.
- `src/services/webhook-service.ts` -- delivery uses signed envelopes.
- `src/api/auth.ts` -- API key lookup is opaque to timing observation.
