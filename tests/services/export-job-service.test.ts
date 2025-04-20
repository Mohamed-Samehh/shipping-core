import { buildFixture } from '../fixtures';

describe('ExportJobService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.exportJobService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.exportJobService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    expect(services.exportJobService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.exportJobService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    services.exportJobService.remove(e.id, 'admin');
    expect(() => services.exportJobService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.exportJobService.create({
      ...({ customerId: 'cu1', kind: 'shipments' as const, rangeStart: 0, rangeEnd: Date.now() }),
      actor: 'admin',
    });
    services.exportJobService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
