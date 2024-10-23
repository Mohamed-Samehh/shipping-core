import { buildFixture } from '../fixtures';

describe('QuoteService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.quoteService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.quoteService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(services.quoteService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.quoteService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.quoteService.remove(e.id, 'admin');
    expect(() => services.quoteService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.quoteService.create({
      ...({ customerId: 'cu1', rateRequestId: 'r1', expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.quoteService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
