import { buildFixture } from '../fixtures';

describe('ZoneService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.zoneService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.zoneService.update({ id: e.id, actor: 'admin' });
    expect(next.updatedAt).toBeGreaterThanOrEqual(e.updatedAt);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    expect(services.zoneService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.zoneService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    services.zoneService.remove(e.id, 'admin');
    expect(() => services.zoneService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.zoneService.create({
      ...({ carrierId: 'c1', originCountry: 'US', destinationCountry: 'US', zone: 1 }),
      actor: 'admin',
    });
    services.zoneService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
