import { buildFixture } from '../fixtures';

describe('ContractService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.contractService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.contractService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    expect(services.contractService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.contractService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    services.contractService.remove(e.id, 'admin');
    expect(() => services.contractService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.contractService.create({
      ...({ customerId: 'cu1', name: 'Standard', effectiveAt: Date.now(), expiresAt: Date.now() + 86400000 * 365 }),
      actor: 'admin',
    });
    services.contractService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
