// examples/webhook-verify.ts
//
// Show how a webhook receiver verifies the `Helix-Signature` header. Run
// against a sample payload to confirm the helper accepts and rejects
// correctly.

import { sign, formatHeader, parseHeader, verify } from '../src/lib/signature';

function main(): void {
  const secret = 'shared-secret-from-endpoint';
  const payload = JSON.stringify({
    event: 'shipment.booked',
    shipmentId: 'shp_42',
    trackingNumber: '1Z999AA10123456784',
    occurredAt: '2025-05-15T10:00:00Z',
  });

  // ----- sender side -----
  const ts = Math.floor(Date.now() / 1000);
  const header = formatHeader(sign(payload, secret, ts));
  console.log('outbound header:', header);

  // ----- receiver side -----
  const parsed = parseHeader(header);
  if (!parsed) throw new Error('bad header');

  // Within 5 minute tolerance.
  const ok = verify(payload, secret, parsed, 300, Date.now());
  console.log('verify:', ok);

  // Tampered payload should fail.
  const tampered = payload.replace('shp_42', 'shp_99');
  console.log('tampered verify:', verify(tampered, secret, parsed, 300, Date.now()));
}

main();
