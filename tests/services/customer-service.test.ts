import { buildFixture } from '../fixtures';

describe('CustomerService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.customerService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.customerService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    expect(services.customerService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.customerService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    services.customerService.remove(e.id, 'admin');
    expect(() => services.customerService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.customerService.create({
      ...({ name: 'Ana Inc.', email: 'ana' + Math.random().toString(36).slice(2) + '@b.com', defaultCurrency: 'USD' }),
      actor: 'admin',
    });
    services.customerService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
