# Examples

Self-contained TypeScript snippets that exercise the shipping-core public
surface. Each file is runnable via `npx ts-node examples/<file>.ts` after
`npm install`.

## Quickstart

[`quickstart.ts`](quickstart.ts) -- spins the fixture, creates a customer,
shipment, package, rate and tracking event, then prints the audit log.

## Rate shopping

[`rate-shopping.ts`](rate-shopping.ts) -- fans out a rate request to three
carriers, filters by transit-day deadline, picks the cheapest.

## Webhook verification

[`webhook-verify.ts`](webhook-verify.ts) -- shows sender + receiver wiring
for the `Helix-Signature` header.

## Dim / billable weight

[`dim-billable.ts`](dim-billable.ts) -- calculates dim weight and billable
weight for a few real-world parcels at two different dim factors.
