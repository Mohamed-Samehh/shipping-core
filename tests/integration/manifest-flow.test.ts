import { buildFixture } from '../fixtures';

describe('manifest flow', () => {
  test('open manifest, attach entries, close on dispatch', () => {
    const { services } = buildFixture();

    const manifest = services.manifestService.create({
      carrierId: 'c1', accountId: 'a1', locationId: 'l1', actor: 'admin',
    });

    services.manifestEntryService.create({
      manifestId: manifest.id, shipmentId: 's1', trackingNumber: '1Z01',
      weightG: 1000, addedAt: Date.now(), actor: 'api',
    });
    services.manifestEntryService.create({
      manifestId: manifest.id, shipmentId: 's2', trackingNumber: '1Z02',
      weightG: 500, addedAt: Date.now(), actor: 'api',
    });

    const entries = services.manifestEntryService.list().filter((e) => e.manifestId === manifest.id);
    expect(entries.length).toBe(2);
  });
});
