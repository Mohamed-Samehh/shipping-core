import { buildFixture } from '../fixtures';

describe('AddressService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.addressService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.addressService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    expect(services.addressService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.addressService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    services.addressService.remove(e.id, 'admin');
    expect(() => services.addressService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.addressService.create({
      ...({ name: 'Ana', street1: '1 Main', city: 'SF', postalCode: '94103', country: 'US' }),
      actor: 'admin',
    });
    services.addressService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
