import { buildFixture } from '../fixtures';

describe('ManifestEntryService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.manifestEntryService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.manifestEntryService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.manifestEntryService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.manifestEntryService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    services.manifestEntryService.remove(e.id, 'admin');
    expect(() => services.manifestEntryService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.manifestEntryService.create({
      ...({ manifestId: 'm1', shipmentId: 's1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), weightG: 1000, addedAt: Date.now() }),
      actor: 'admin',
    });
    services.manifestEntryService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
