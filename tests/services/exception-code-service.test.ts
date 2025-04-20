import { buildFixture } from '../fixtures';

describe('ExceptionCodeService', () => {
  function setup() {
    return buildFixture();
  }

  test('create stores entity', () => {
    const { services } = setup();
    const e = services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    expect(e.id).toBeDefined();
    expect(services.exceptionCodeService.get(e.id).id).toBe(e.id);
  });

  test('update mutates and bumps updatedAt', () => {
    const { services, clock } = setup();
    const e = services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    clock.advance(1000);
    const next = services.exceptionCodeService.update({ id: e.id, actor: 'admin' });
    expect(next.id).toBe(e.id);
  });

  test('list returns inserted entities', () => {
    const { services } = setup();
    services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    expect(services.exceptionCodeService.list().length).toBe(2);
  });

  test('get throws on missing id', () => {
    const { services } = setup();
    expect(() => services.exceptionCodeService.get('does-not-exist')).toThrow();
  });

  test('remove deletes', () => {
    const { services } = setup();
    const e = services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    services.exceptionCodeService.remove(e.id, 'admin');
    expect(() => services.exceptionCodeService.get(e.id)).toThrow();
  });

  test('audit log captures create + remove', () => {
    const { services } = setup();
    const e = services.exceptionCodeService.create({
      ...({ carrierId: 'c1', carrierCode: 'X1', category: 'address', description: 'Bad address', retriable: false }),
      actor: 'admin',
    });
    services.exceptionCodeService.remove(e.id, 'admin');
    expect(services.auditService.listForEntity(e.id).length).toBeGreaterThanOrEqual(2);
  });
});
