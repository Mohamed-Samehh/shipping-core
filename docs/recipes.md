# Recipes

Pre-baked snippets for common shipping-core workflows. Each recipe is a
self-contained TypeScript example you can copy-paste into the fixture.

## Create a customer with an address

```ts
import { buildFixture } from './fixtures';

const { services } = buildFixture();

const customer = services.customerService.create({
  name: 'Ana Pereira',
  email: 'ana@example.com',
  defaultCurrency: 'USD',
  actor: 'admin',
});

const address = services.addressService.create({
  name: 'Ana Pereira',
  street1: '123 Mission St',
  city: 'San Francisco',
  region: 'CA',
  postalCode: '94103',
  country: 'US',
  actor: 'admin',
});
```

## Rate-shop a shipment

```ts
const shipment = services.shipmentService.create({
  customerId: customer.id,
  fromAddressId: warehouse.id,
  toAddressId: address.id,
  actor: 'api',
});

const package_ = services.packageService.create({
  shipmentId: shipment.id,
  lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000,
  actor: 'api',
});

const rates: Rate[] = [];
for (const carrierId of ['ups-1', 'fedex-1', 'dhl-1']) {
  const rate = services.rateService.create({
    shipmentId: shipment.id,
    carrierId,
    serviceId: `${carrierId}-ground`,
    amount: 1099n, currency: 'USD',
    baseAmount: 1099n,
    estimatedTransitDays: 3,
    expiresAt: Date.now() + 3_600_000,
    actor: 'rates',
  });
  rates.push(rate);
}

const cheapest = rates.reduce((best, r) => (r.amount < best.amount ? r : best), rates[0]!);
```

## Issue and void a label

```ts
const label = services.labelService.create({
  shipmentId: shipment.id,
  packageId: package_.id,
  trackingNumber: '1Z' + Math.random().toString(36).slice(2),
  format: 'pdf',
  url: 'https://carrier.example/labels/abc.pdf',
  expiresAt: Date.now() + 28 * 86_400_000,
  actor: 'api',
});

// Later (e.g. customer cancels before pickup):
services.labelService.update({
  id: label.id,
  status: 'voided',
  voidReason: 'customer-cancelled',
  voidedAt: Date.now(),
  actor: 'cs',
});
```

## Manifest at end of day

```ts
const manifest = services.manifestService.create({
  carrierId: 'ups-1',
  accountId: 'acct-ups-1',
  locationId: warehouse.id,
  actor: 'dispatch',
});

for (const shp of shipmentsReadyForUps) {
  services.manifestEntryService.create({
    manifestId: manifest.id,
    shipmentId: shp.id,
    trackingNumber: shp.trackingNumber!,
    weightG: shp.weightG,
    addedAt: Date.now(),
    actor: 'dispatch',
  });
}

services.manifestService.update({
  id: manifest.id,
  status: 'closed',
  closedAt: Date.now(),
  actor: 'dispatch',
});
```

## Ingest a tracking event

```ts
// Webhook payload from carrier
const event = services.trackingEventService.create({
  shipmentId: shipment.id,
  trackingNumber: shipment.trackingNumber!,
  status: 'out_for_delivery',
  description: 'Out for delivery -- San Francisco',
  locationCity: 'San Francisco',
  locationCountry: 'US',
  occurredAt: Date.parse('2025-05-15T08:30:00Z'),
  recordedAt: Date.now(),
  actor: 'carrier-webhook',
});
```

## Open a return

```ts
const returnRecord = services.returnService.create({
  customerId: customer.id,
  outboundShipmentId: shipment.id,
  reason: 'damaged',
  reasonNote: 'corner crushed in transit',
  actor: 'cs',
});
```

## Customs declaration for international parcel

```ts
const decl = services.customsDeclarationService.create({
  shipmentId: intlShipment.id,
  type: 'merchandise',
  incoterm: 'DAP',
  reasonForExport: 'sale of consumer goods',
  actor: 'admin',
});

services.customsItemService.create({
  declarationId: decl.id,
  description: 'cotton t-shirts',
  hsCode: '610910',
  countryOfOrigin: 'US',
  quantity: 3,
  unitValueAmount: 2500n,
  unitValueCurrency: 'USD',
  unitWeightG: 200,
  actor: 'admin',
});
```

## Subscribe a webhook endpoint

```ts
const endpoint = services.webhookEndpointService.create({
  customerId: customer.id,
  url: 'https://shop.example/webhooks/shipping',
  secret: 'a-long-shared-secret-string',
  events: ['shipment.booked', 'shipment.delivered', 'shipment.exception'],
  actor: 'admin',
});
```

## Sign and verify a webhook payload

```ts
import { sign, formatHeader, parseHeader, verify } from '@helix/shipping-core';

// at delivery time
const ts = Math.floor(Date.now() / 1000);
const signature = sign(payload, endpoint.secret, ts);
const header = formatHeader(signature);  // -> "t=1700000000,v1=..."

// at receiver
const parsed = parseHeader(req.headers['helix-signature']);
if (!parsed) reply(401);
if (!verify(rawBody, endpoint.secret, parsed, 300, Date.now())) reply(401);
```

## Detect dim weight

```ts
import { dimensions, weight, billableWeight, formatWeight } from '@helix/shipping-core';

const dim = dimensions(40, 30, 20, 'cm');           // 24000 cm3
const actual = weight(2.5, 'kg');                   // light, bulky
const billable = billableWeight(dim, actual, 5000); // dim weight wins

console.log(formatWeight(billable, 'kg', 2));       // "4.80 kg"
```

## Detect mail class

```ts
import { detectMailClass } from '@helix/shipping-core';

detectMailClass(
  dimensions(280, 100, 5, 'mm'),
  weight(50, 'g'),
  { isInternational: false },
); // -> 'first-class-letter'

detectMailClass(
  dimensions(300, 200, 100, 'mm'),
  weight(20, 'kg'),
  { isInternational: false },
); // -> 'priority-mail'
```

## Validate against carrier limits

```ts
import { validateCarrierLimits } from '@helix/shipping-core';

const failures = validateCarrierLimits(
  'USPS',
  dimensions(300, 200, 100, 'mm'),
  weight(40, 'kg'),
  5000_00n,
);

if (failures.length > 0) {
  // failures looks like:
  // [{ code: 'WEIGHT_TOO_HEAVY', message: '40000g exceeds 31750g for USPS' }]
}
```

## Schedule a pickup

```ts
const pickup = services.pickupRequestService.create({
  carrierId: 'ups-1',
  addressId: warehouse.id,
  requestedWindowStart: Date.parse('2025-05-16T10:00:00Z'),
  requestedWindowEnd: Date.parse('2025-05-16T18:00:00Z'),
  driverNote: 'Back loading dock, ring bell',
  actor: 'dispatch',
});
```

## Plan a multi-stop route

```ts
const route = services.routeService.create({
  driverId: driver.id,
  vehicleId: van.id,
  plannedStart: Date.parse('2025-05-16T08:00:00Z'),
  plannedEnd: Date.parse('2025-05-16T17:00:00Z'),
  actor: 'dispatch',
});

for (let i = 0; i < stops.length; i++) {
  services.routeStopService.create({
    routeId: route.id,
    sequence: i,
    kind: stops[i].kind,
    addressId: stops[i].addressId,
    windowStart: stops[i].windowStart,
    windowEnd: stops[i].windowEnd,
    actor: 'dispatch',
  });
}
```

## Query the audit log for a shipment

```ts
const events = services.auditService.listForEntity(shipment.id);
for (const e of events) {
  console.log(`${new Date(e.recordedAt).toISOString()} ${e.actor} ${e.action}`);
}
```

## Pick the closest pickup depot to a destination

```ts
import { nearest } from '@helix/shipping-core';

const depots = services.locationService.list();
const destination = services.addressService.get(shipment.toAddressId);

// Address doesn't carry lat/lng directly; production wrappers join with a
// geocode lookup. Here we assume a `locations` array of {id, lat, lng}.
const chosen = nearest({ lat: destination.lat, lng: destination.lng }, locations);
```
