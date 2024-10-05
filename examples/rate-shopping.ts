// examples/rate-shopping.ts
//
// Compare rates from three carriers, pick the cheapest that meets the
// promised delivery deadline, and book the shipment against it.

import { buildFixture } from '../tests/fixtures';
import { Rate } from '../src/domain/rate';

async function main(): Promise<void> {
  const { services } = buildFixture();

  const shipment = services.shipmentService.create({
    customerId: 'cu_demo',
    fromAddressId: 'addr-from',
    toAddressId: 'addr-to',
    actor: 'demo',
  });

  const ratesIn: Array<{ carrierId: string; serviceId: string; cents: bigint; days: number }> = [
    { carrierId: 'ups',   serviceId: 'ground',  cents: 1099n, days: 5 },
    { carrierId: 'fedex', serviceId: 'home',    cents:  999n, days: 7 },
    { carrierId: 'usps',  serviceId: 'priority', cents: 1299n, days: 3 },
    { carrierId: 'dhl',   serviceId: 'express', cents: 2499n, days: 1 },
  ];

  const rates: Rate[] = ratesIn.map((r) =>
    services.rateService.create({
      shipmentId: shipment.id,
      carrierId: r.carrierId,
      serviceId: r.serviceId,
      amount: r.cents, currency: 'USD', baseAmount: r.cents,
      estimatedTransitDays: r.days,
      expiresAt: Date.now() + 3_600_000, actor: 'rates',
    }),
  );

  // Need to arrive within 4 days. Cheapest among those that meet the deadline.
  const eligible = rates.filter((r) => r.estimatedTransitDays <= 4);
  if (eligible.length === 0) {
    console.error('no eligible rate within 4 days');
    process.exit(2);
  }
  const cheapest = eligible.reduce((best, r) => (r.amount < best.amount ? r : best), eligible[0]!);

  console.log('cheapest rate:', cheapest.carrierId, cheapest.serviceId, cheapest.amount.toString(), 'cents');

  services.shipmentService.update({
    id: shipment.id,
    status: 'booked',
    bookedAt: Date.now(),
    carrierId: cheapest.carrierId,
    serviceId: cheapest.serviceId,
    totalAmount: cheapest.amount,
    currency: cheapest.currency,
    actor: 'demo',
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
