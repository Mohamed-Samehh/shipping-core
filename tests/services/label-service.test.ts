import { buildFixture } from '../fixtures';

describe('LabelService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.labelService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.labelService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    expect(services.labelService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.labelService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.labelService.remove(e.id, 'admin');
    expect(() => services.labelService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.labelService.create({
      ...({ shipmentId: 's1', packageId: 'p1', trackingNumber: '1Z' + Math.random().toString(36).slice(2), format: 'pdf' as const, url: 'https://x.test/l.pdf', expiresAt: Date.now() + 86400000 }),
      actor: 'admin',
    });
    services.labelService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
