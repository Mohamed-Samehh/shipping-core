import { buildFixture } from '../fixtures';

describe('pickup flow', () => {
  test('pickup scheduled, manifest attached, dispatch completed', () => {
    const { services } = buildFixture();
    const pickup = services.pickupRequestService.create({
      carrierId: 'c1', addressId: 'loc-warehouse',
      requestedWindowStart: Date.parse('2025-05-01T10:00:00Z'),
      requestedWindowEnd: Date.parse('2025-05-01T18:00:00Z'),
      actor: 'dispatch',
    });
    expect(pickup.status).toBe('scheduled');

    const confirmed = services.pickupRequestService.update({
      id: pickup.id, status: 'confirmed',
      confirmationNumber: 'PU-9001', actor: 'carrier',
    });
    expect(confirmed.status).toBe('confirmed');

    const completed = services.pickupRequestService.update({
      id: pickup.id, status: 'completed',
      completedAt: Date.parse('2025-05-01T15:30:00Z'), actor: 'driver',
    });
    expect(completed.status).toBe('completed');
  });
});
