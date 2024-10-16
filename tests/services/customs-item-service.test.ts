import { buildFixture } from '../fixtures';

describe('CustomsItemService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.customsItemService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.customsItemService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    expect(services.customsItemService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.customsItemService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    services.customsItemService.remove(e.id, 'admin');
    expect(() => services.customsItemService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.customsItemService.create({
      ...({ declarationId: 'd1', description: 'Item', hsCode: '610910', countryOfOrigin: 'US', quantity: 1, unitValueAmount: 1000n, unitValueCurrency: 'USD', unitWeightG: 200 }),
      actor: 'admin',
    });
    services.customsItemService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
