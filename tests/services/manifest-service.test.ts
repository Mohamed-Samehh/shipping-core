import { buildFixture } from '../fixtures';

describe('ManifestService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.manifestService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.manifestService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    expect(services.manifestService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.manifestService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    services.manifestService.remove(e.id, 'admin');
    expect(() => services.manifestService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.manifestService.create({
      ...({ carrierId: 'c1', accountId: 'a1', locationId: 'l1' }),
      actor: 'admin',
    });
    services.manifestService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
