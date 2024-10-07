import { buildFixture } from '../fixtures';

describe('tag segmentation', () => {
  test('shipments are taggable by entity key', () => {
    const { services } = buildFixture();
    services.tagService.create({
      entityKind: 'shipment', entityId: 'sh1',
      key: 'priority', value: 'express', actor: 'admin',
    });
    services.tagService.create({
      entityKind: 'shipment', entityId: 'sh2',
      key: 'priority', value: 'standard', actor: 'admin',
    });
    services.tagService.create({
      entityKind: 'shipment', entityId: 'sh3',
      key: 'priority', value: 'express', actor: 'admin',
    });
    const express = services.tagService.list()
      .filter((t) => t.entityKind === 'shipment' && t.value === 'express');
    expect(express).toHaveLength(2);
  });
});
