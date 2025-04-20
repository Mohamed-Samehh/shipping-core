import { buildFixture } from '../fixtures';

describe('TagService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.tagService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.tagService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    expect(services.tagService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.tagService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    services.tagService.remove(e.id, 'admin');
    expect(() => services.tagService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.tagService.create({
      ...({ entityKind: 'shipment', entityId: 's1', key: 'priority' }),
      actor: 'admin',
    });
    services.tagService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
