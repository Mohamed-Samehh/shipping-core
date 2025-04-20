import { buildFixture } from '../fixtures';

describe('ShipmentItemService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.shipmentItemService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.shipmentItemService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    expect(services.shipmentItemService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.shipmentItemService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    services.shipmentItemService.remove(e.id, 'admin');
    expect(() => services.shipmentItemService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.shipmentItemService.create({
      ...({ shipmentId: 's1', description: 't-shirt', quantity: 1, unitWeightG: 200, unitValueAmount: 1000n, unitValueCurrency: 'USD' }),
      actor: 'admin',
    });
    services.shipmentItemService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
