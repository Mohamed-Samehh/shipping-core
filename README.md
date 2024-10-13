# shipping-core

> Shipping and dispatch primitives -- carriers, services, accounts, rates,
> shipments, packages, labels, manifests, tracking, customs declarations,
> returns, pickup requests, webhooks and reporting -- on top of an in-memory
> persistence stack suitable for tests and lightweight deployments.

`@helix/shipping-core` is the parcel-and-freight dispatch library for the
Helix fulfilment platform. It models carriers and their service offerings,
customer accounts and contracts, the rate-shopping flow that produces
quotes, shipments and their packages, labels and manifests, signed outbound
webhooks, customs declarations, returns, pickup requests, dispatch slots and
the full tracking history. It ships an in-memory persistence stack so tests,
preview environments and one-off scripts can spin the full shipping flow up
in under a second.

The package targets Node.js 20 LTS and is published as a private
ESM-compatible CommonJS bundle. The public surface is the `src/index.ts`
barrel.

## Module layout

```
src/
|-- api/                # HTTP plumbing (router, server, auth, error handler)
|-- domain/             # Plain types and zod schemas for every entity
|-- lib/                # Cross-cutting helpers (money, weight, dimensions, ...)
|-- repositories/       # In-memory persistence backing each entity
`-- services/           # Business logic (shipments, labels, manifests, ...)
```

See [docs/architecture.md](docs/architecture.md) for the ring rules and
[docs/operations.md](docs/operations.md) for the dispatch playbook.

## Local development

```sh
npm install
npm run typecheck
npm test
```

Build the publishable artifact with `npm run build` -- emitted into `dist/`
per `tsconfig.build.json`.

## Subsystems

| Subsystem | Domain | Service |
|-----------|--------|---------|
| Customers | `customer`, `location`, `address` | `CustomerService`, `LocationService`, `AddressService` |
| Carriers | `carrier`, `service`, `account` | `CarrierService`, `ServiceService`, `AccountService` |
| Shipments | `shipment`, `shipment-item`, `package`, `package-type` | `ShipmentService`, `PackageService` |
| Labels | `label` | `LabelService` |
| Manifests | `manifest`, `manifest-entry` | `ManifestService`, `ManifestEntryService` |
| Rates | `rate`, `rate-request`, `surcharge`, `discount`, `zone` | `RateService`, `SurchargeService`, `DiscountService`, `ZoneService` |
| Tracking | `tracking-event`, `proof-of-delivery`, `delivery-exception`, `exception-code` | `TrackingEventService` |
| Customs | `customs-declaration`, `customs-item`, `hazmat-declaration` | `CustomsDeclarationService`, `HazmatDeclarationService` |
| Returns | `return` | `ReturnService` |
| Pickup | `pickup-request`, `dispatch-slot` | `PickupRequestService`, `DispatchSlotService` |
| Dispatch | `route`, `route-stop`, `vehicle`, `driver` | `RouteService`, `VehicleService`, `DriverService` |
| Webhooks | `webhook-endpoint`, `webhook-delivery` | `WebhookEndpointService` |
| Insurance | `insurance` | `InsuranceService` |
| Sales | `quote`, `contract` | `QuoteService`, `ContractService` |
| Notifications | `notification` | `NotificationService` |
| Reporting | `forecast`, `export-job` | `ForecastService`, `ExportJobService` |
| Audit | `audit-event`, `tag`, `signature-record` | `AuditService`, `TagService`, `SignatureRecordService` |

## Usage sketch

```ts
import { buildFixture } from './tests/fixtures';

const fixture = buildFixture();
const { services } = fixture;

const customer = services.customerService.create({
  name: 'Ana Inc.',
  email: 'ops@ana.example.com',
  defaultCurrency: 'USD',
  actor: 'admin',
});

const from = services.addressService.create({
  name: 'Warehouse', street1: '1 Bay St', city: 'SF',
  postalCode: '94103', country: 'US',
  actor: 'admin',
});
const to = services.addressService.create({
  name: 'Buyer', street1: '99 Park Ave', city: 'NY',
  postalCode: '10010', country: 'US',
  actor: 'admin',
});

const shipment = services.shipmentService.create({
  customerId: customer.id,
  fromAddressId: from.id,
  toAddressId: to.id,
  actor: 'api',
});
```

## Repository stats

* >= 60 source lib modules
* >= 40 in-memory repositories
* >= 40 services covering the full dispatch surface
* >= 250 unit and integration tests
