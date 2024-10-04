// examples/quickstart.ts
//
// Spin up the full shipping-core fixture, create one customer + one
// shipment + one rate + one tracking event, and print the audit log.
//
// Run with: npx ts-node examples/quickstart.ts (after `npm install`).

import { buildFixture } from '../tests/fixtures';

async function main(): Promise<void> {
  const fixture = buildFixture();
  const { services } = fixture;

  // 1. Customer + addresses.
  const customer = services.customerService.create({
    name: 'Ana Pereira',
    email: 'ana@example.com',
    defaultCurrency: 'USD',
    actor: 'admin',
  });

  const from = services.addressService.create({
    name: 'Helix Warehouse',
    street1: '123 Industrial Way',
    city: 'San Francisco',
    region: 'CA',
    postalCode: '94103',
    country: 'US',
    isResidential: false,
    actor: 'admin',
  });

  const to = services.addressService.create({
    name: 'Ana Pereira',
    street1: '99 Park Ave',
    city: 'New York',
    region: 'NY',
    postalCode: '10010',
    country: 'US',
    isResidential: true,
    actor: 'admin',
  });

  // 2. Shipment + package.
  const shipment = services.shipmentService.create({
    customerId: customer.id,
    fromAddressId: from.id,
    toAddressId: to.id,
    reference: 'ORD-1001',
    actor: 'api',
  });

  const package_ = services.packageService.create({
    shipmentId: shipment.id,
    lengthMm: 300, widthMm: 200, heightMm: 100, weightG: 1000,
    contentDescription: 't-shirts (cotton)',
    actor: 'api',
  });

  // 3. Rate + book.
  const rate = services.rateService.create({
    shipmentId: shipment.id,
    carrierId: 'ups-1',
    serviceId: 'ups-1-ground',
    amount: 1099n, currency: 'USD',
    baseAmount: 1099n,
    surchargesAmount: 0n,
    discountAmount: 0n,
    taxAmount: 0n,
    estimatedTransitDays: 3,
    expiresAt: Date.now() + 3_600_000,
    actor: 'rates',
  });

  services.shipmentService.update({
    id: shipment.id,
    status: 'booked',
    bookedAt: Date.now(),
    trackingNumber: '1Z999AA10123456784',
    totalAmount: rate.amount,
    currency: rate.currency,
    carrierId: rate.carrierId,
    serviceId: rate.serviceId,
    actor: 'api',
  });

  // 4. Tracking event.
  services.trackingEventService.create({
    shipmentId: shipment.id,
    trackingNumber: '1Z999AA10123456784',
    status: 'in_transit',
    description: 'Departed Helix Warehouse',
    locationCity: 'San Francisco',
    locationCountry: 'US',
    occurredAt: Date.now(),
    recordedAt: Date.now(),
    actor: 'carrier-webhook',
  });

  // 5. Audit trail.
  const trail = services.auditService.listForEntity(shipment.id);
  for (const event of trail) {
    const ts = new Date(event.recordedAt).toISOString();
    console.log(`${ts} ${event.actor} ${event.action}`);
  }
  void package_;  // referenced by id only in this example
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
