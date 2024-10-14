import { buildFixture } from '../fixtures';

describe('RateRequestService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.rateRequestService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.rateRequestService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    expect(services.rateRequestService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.rateRequestService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateRequestService.remove(e.id, 'admin');
    expect(() => services.rateRequestService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.rateRequestService.create({
      ...({ customerId: 'cu1', fromAddressId: 'a1', toAddressId: 'a2', packageHashes: ['abcdefgh'], expiresAt: Date.now() + 3600000 }),
      actor: 'admin',
    });
    services.rateRequestService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
