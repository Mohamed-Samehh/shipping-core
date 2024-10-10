import { buildFixture } from '../fixtures';

describe('return flow', () => {
  test('outbound -> requested -> approved -> closed', () => {
    const { services } = buildFixture();
    const ret = services.returnService.create({
      customerId: 'c1', outboundShipmentId: 'sh1', reason: 'damaged', actor: 'cs',
    });

    expect(ret.status).toBe('requested');

    const approved = services.returnService.update({
      id: ret.id, status: 'approved', approvedAt: Date.now(), actor: 'cs',
    });
    expect(approved.status).toBe('approved');

    const closed = services.returnService.update({
      id: ret.id, status: 'closed', closedAt: Date.now(), actor: 'cs',
    });
    expect(closed.status).toBe('closed');
  });
});
