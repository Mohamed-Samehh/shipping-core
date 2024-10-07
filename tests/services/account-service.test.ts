import { buildFixture } from '../fixtures';

describe('AccountService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.accountService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.accountService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    expect(services.accountService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.accountService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    services.accountService.remove(e.id, 'admin');
    expect(() => services.accountService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.accountService.create({
      ...({ carrierId: 'c1', externalRef: 'EXT-' + Math.random().toString(36).slice(2), alias: 'Default' }),
      actor: 'admin',
    });
    services.accountService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
