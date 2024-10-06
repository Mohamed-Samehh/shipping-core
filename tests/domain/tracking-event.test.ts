import { parseTrackingEvent, isDeliveryEvent, isExceptionEvent } from '../../src/domain/tracking-event';

const base = {
  id: 'trk_1', shipmentId: 's1', trackingNumber: '1Z01',
  status: 'in_transit' as const, description: 'Departed',
  occurredAt: 100, recordedAt: 200, metadata: {},
};

describe('TrackingEvent schema', () => {
  test('parseTrackingEvent accepts a valid record', () => {
    expect(parseTrackingEvent(base).status).toBe('in_transit');
  });

  test('isDeliveryEvent only for delivered', () => {
    expect(isDeliveryEvent(parseTrackingEvent({ ...base, status: 'delivered' }))).toBe(true);
    expect(isDeliveryEvent(parseTrackingEvent(base))).toBe(false);
  });

  test('isExceptionEvent only for exception', () => {
    expect(isExceptionEvent(parseTrackingEvent({ ...base, status: 'exception' }))).toBe(true);
    expect(isExceptionEvent(parseTrackingEvent(base))).toBe(false);
  });

  test('rejects unknown status', () => {
    expect(() => parseTrackingEvent({ ...base, status: 'lost' as never })).toThrow();
  });
});
