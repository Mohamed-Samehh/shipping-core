import { parseWebhookDelivery, isDeliveryTerminal, canRetry } from '../../src/domain/webhook-delivery';

const base = {
  id: 'wd_1', endpointId: 'e1', eventName: 'shipment.booked',
  payload: '{}', status: 'pending' as const,
  attempt: 0, maxAttempts: 5, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('WebhookDelivery schema', () => {
  test('parseWebhookDelivery accepts a valid record', () => {
    expect(parseWebhookDelivery(base).status).toBe('pending');
  });

  test('terminal includes delivered and gave_up', () => {
    expect(isDeliveryTerminal(parseWebhookDelivery({ ...base, status: 'delivered' }))).toBe(true);
    expect(isDeliveryTerminal(parseWebhookDelivery({ ...base, status: 'gave_up' }))).toBe(true);
    expect(isDeliveryTerminal(parseWebhookDelivery(base))).toBe(false);
  });

  test('canRetry while pending and attempt < max', () => {
    expect(canRetry(parseWebhookDelivery({ ...base, attempt: 2 }))).toBe(true);
    expect(canRetry(parseWebhookDelivery({ ...base, attempt: 5 }))).toBe(false);
    expect(canRetry(parseWebhookDelivery({ ...base, status: 'delivered' }))).toBe(false);
  });
});
