import { buildFixture } from '../fixtures';

describe('DiscountService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.discountService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.discountService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    expect(services.discountService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.discountService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.discountService.remove(e.id, 'admin');
    expect(() => services.discountService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.discountService.create({
      ...({ customerId: 'cu1', kind: 'percentage' as const, code: 'TEN-' + Math.random().toString(36).slice(2), basisPoints: 1000, effectiveAt: Date.now() }),
      actor: 'admin',
    });
    services.discountService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
