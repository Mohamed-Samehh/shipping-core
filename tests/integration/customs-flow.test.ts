import { buildFixture } from '../fixtures';

describe('customs declaration flow', () => {
  test('international shipment carries declaration and items', () => {
    const { services } = buildFixture();
    const decl = services.customsDeclarationService.create({
      shipmentId: 'sh-int-1', type: 'merchandise', incoterm: 'DAP', actor: 'admin',
    });
    services.customsItemService.create({
      declarationId: decl.id, description: 'cotton t-shirts',
      hsCode: '610910', countryOfOrigin: 'US', quantity: 5,
      unitValueAmount: 1500n, unitValueCurrency: 'USD',
      unitWeightG: 200, actor: 'admin',
    });
    services.customsItemService.create({
      declarationId: decl.id, description: 'handbag',
      hsCode: '420221', countryOfOrigin: 'IT', quantity: 1,
      unitValueAmount: 12000n, unitValueCurrency: 'USD',
      unitWeightG: 500, actor: 'admin',
    });

    const items = services.customsItemService.list()
      .filter((i) => i.declarationId === decl.id);
    expect(items).toHaveLength(2);
    const total = items.reduce((acc, i) => acc + i.unitValueAmount * BigInt(i.quantity), 0n);
    expect(total).toBe(7500n + 12000n);
  });
});
