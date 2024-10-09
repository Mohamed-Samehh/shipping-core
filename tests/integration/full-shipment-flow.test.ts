import { buildFixture } from '../fixtures';

describe('full shipping flow', () => {
  test('customer -> address -> shipment -> tracking -> delivery', () => {
    const { services } = buildFixture();

    const customer = services.customerService.create({
      name: 'Ana Inc.', email: 'ops@ana.example.com', defaultCurrency: 'USD', actor: 'admin',
    });

    const from = services.addressService.create({
      name: 'Warehouse', street1: '1 Bay St', city: 'SF', postalCode: '94103', country: 'US',
      actor: 'admin',
    });

    const to = services.addressService.create({
      name: 'Buyer', street1: '99 Park Ave', city: 'NY', postalCode: '10010', country: 'US',
      actor: 'admin',
    });

    const shipment = services.shipmentService.create({
      customerId: customer.id, fromAddressId: from.id, toAddressId: to.id, actor: 'api',
    });

    services.trackingEventService.create({
      shipmentId: shipment.id,
      trackingNumber: '1Z' + shipment.id,
      status: 'in_transit',
      description: 'Departed origin',
      occurredAt: Date.now(),
      recordedAt: Date.now(),
      actor: 'carrier',
    });

    services.trackingEventService.create({
      shipmentId: shipment.id,
      trackingNumber: '1Z' + shipment.id,
      status: 'delivered',
      description: 'Delivered to recipient',
      occurredAt: Date.now(),
      recordedAt: Date.now(),
      actor: 'carrier',
    });

    expect(services.trackingEventService.list().filter((e) => e.shipmentId === shipment.id).length).toBe(2);
  });
});
