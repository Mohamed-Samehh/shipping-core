import { buildFixture } from '../fixtures';

describe('hazmat declaration', () => {
  test('high-risk hazard classes are recorded with signature', () => {
    const { services } = buildFixture();
    const decl = services.hazmatDeclarationService.create({
      shipmentId: 'sh-haz-1', unNumber: 'UN3480',
      properShippingName: 'Lithium-ion batteries',
      hazardClass: '9', netQuantityG: 1500,
      signedBy: 'Compliance Officer',
      signedAt: Date.parse('2025-04-21T12:00:00Z'),
      actor: 'compliance',
    });
    expect(decl.hazardClass).toBe('9');
    expect(decl.signedBy).toBe('Compliance Officer');
  });
});
