import { AuditService } from '../../src/services/audit-service';
import { AuditEventRepository } from '../../src/repositories/audit-event-repository';
import { FixedClock } from '../../src/lib/clock';
import { CounterIdGenerator } from '../../src/lib/id';

function buildService() {
  const clock = new FixedClock('2025-01-01T00:00:00Z');
  const ids = new CounterIdGenerator('audit');
  const repo = new AuditEventRepository(clock);
  const service = new AuditService(repo, clock, ids);
  return { service, repo, clock };
}

describe('AuditService', () => {
  test('record stores an event', () => {
    const { service, repo } = buildService();
    const e = service.record({ actor: 'u', action: 'a.x', entityKind: 'shipment', entityId: 's1' });
    expect(repo.get(e.id)).toEqual(e);
  });

  test('record stamps recorded-at from clock', () => {
    const { service, clock } = buildService();
    const e = service.record({ actor: 'u', action: 'a', entityKind: 'shipment', entityId: 's' });
    expect(e.recordedAt).toBe(clock.now());
  });

  test('listForEntity finds by entityId', () => {
    const { service } = buildService();
    service.record({ actor: 'u', action: 'a', entityKind: 'shipment', entityId: 's1' });
    service.record({ actor: 'u', action: 'b', entityKind: 'shipment', entityId: 's2' });
    expect(service.listForEntity('s1')).toHaveLength(1);
  });

  test('listForCustomer finds by customerId', () => {
    const { service } = buildService();
    service.record({ actor: 'u', action: 'a', entityKind: 'x', entityId: '1', customerId: 'c1' });
    service.record({ actor: 'u', action: 'a', entityKind: 'x', entityId: '2', customerId: 'c2' });
    expect(service.listForCustomer('c1')).toHaveLength(1);
  });

  test('countByAction filters by action name', () => {
    const { service } = buildService();
    service.record({ actor: 'u', action: 'a', entityKind: 'x', entityId: '1' });
    service.record({ actor: 'u', action: 'a', entityKind: 'x', entityId: '2' });
    service.record({ actor: 'u', action: 'b', entityKind: 'x', entityId: '3' });
    expect(service.countByAction('a')).toBe(2);
  });

  test('recordMany stores each input', () => {
    const { service } = buildService();
    const out = service.recordMany([
      { actor: 'u', action: 'a', entityKind: 'x', entityId: '1' },
      { actor: 'u', action: 'b', entityKind: 'x', entityId: '2' },
    ]);
    expect(out).toHaveLength(2);
  });

  test('record stores before/after payload', () => {
    const { service } = buildService();
    const e = service.record({
      actor: 'u', action: 'update', entityKind: 'shipment', entityId: 's1',
      before: { status: 'draft' }, after: { status: 'rated' },
    });
    expect(e.before).toEqual({ status: 'draft' });
    expect(e.after).toEqual({ status: 'rated' });
  });
});
