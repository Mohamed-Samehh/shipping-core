import { parseShipment, isShipmentTerminal, isShipmentInTransit, canCancelShipment } from '../../src/domain/shipment';

const base = {
  id: 'shp_1', customerId: 'cu_1', status: 'draft' as const,
  fromAddressId: 'a1', toAddressId: 'a2',
  signatureRequired: false, saturdayDelivery: false, metadata: {},
  createdAt: 0, updatedAt: 0,
};

describe('Shipment schema', () => {
  test('parseShipment accepts a valid record', () => {
    expect(parseShipment(base).status).toBe('draft');
  });

  test('rejects unknown status', () => {
    expect(() => parseShipment({ ...base, status: 'flying' as never })).toThrow();
  });

  test('terminal status set includes delivered, cancelled and returned', () => {
    expect(isShipmentTerminal(parseShipment({ ...base, status: 'delivered' }))).toBe(true);
    expect(isShipmentTerminal(parseShipment({ ...base, status: 'cancelled' }))).toBe(true);
    expect(isShipmentTerminal(parseShipment({ ...base, status: 'returned' }))).toBe(true);
    expect(isShipmentTerminal(parseShipment(base))).toBe(false);
  });

  test('isShipmentInTransit only true for in_transit', () => {
    expect(isShipmentInTransit(parseShipment({ ...base, status: 'in_transit' }))).toBe(true);
    expect(isShipmentInTransit(parseShipment({ ...base, status: 'booked' }))).toBe(false);
  });

  test('canCancelShipment is true for draft / rated / booked', () => {
    expect(canCancelShipment(parseShipment({ ...base, status: 'draft' }))).toBe(true);
    expect(canCancelShipment(parseShipment({ ...base, status: 'rated' }))).toBe(true);
    expect(canCancelShipment(parseShipment({ ...base, status: 'booked' }))).toBe(true);
    expect(canCancelShipment(parseShipment({ ...base, status: 'in_transit' }))).toBe(false);
  });

  test('defaults signatureRequired to false', () => {
    const { signatureRequired: _omit, ...withoutFlag } = base;
    expect(parseShipment(withoutFlag).signatureRequired).toBe(false);
  });
});
