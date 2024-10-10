import { buildFixture } from '../fixtures';

describe('webhook retry', () => {
  test('failed delivery can be retried until terminal', () => {
    const { services } = buildFixture();
    const delivery = services.webhookDeliveryService.create({
      endpointId: 'e1', eventName: 'shipment.booked', payload: '{}', actor: 'sys',
    });

    expect(delivery.status).toBe('pending');

    const failed = services.webhookDeliveryService.update({
      id: delivery.id, attempt: 1, status: 'pending', lastResponseStatus: 500, actor: 'sys',
    });
    expect(failed.attempt).toBe(1);

    const delivered = services.webhookDeliveryService.update({
      id: delivery.id, status: 'delivered', deliveredAt: Date.now(), actor: 'sys',
    });
    expect(delivered.status).toBe('delivered');
  });
});
