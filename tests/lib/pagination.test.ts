import { paginate, clampLimit, clampOffset, encodeCursor, decodeCursor } from '../../src/lib/pagination';

describe('pagination', () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  test('paginate slices items by offset / limit', () => {
    const page = paginate(items, { offset: 5, limit: 10 });
    expect(page.items).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(page.hasMore).toBe(true);
  });

  test('paginate end of list sets hasMore false', () => {
    const page = paginate(items, { offset: 20, limit: 10 });
    expect(page.items.length).toBe(5);
    expect(page.hasMore).toBe(false);
  });

  test('clampLimit clamps to max', () => {
    expect(clampLimit(500)).toBe(200);
    expect(clampLimit(0)).toBe(1);
  });

  test('clampOffset disallows negative', () => {
    expect(clampOffset(-1)).toBe(0);
  });

  test('encodeCursor / decodeCursor roundtrip', () => {
    const cursor = encodeCursor({ id: 'shp_1', ts: 123 });
    expect(decodeCursor(cursor)).toEqual({ id: 'shp_1', ts: 123 });
  });

  test('decodeCursor rejects garbage', () => {
    expect(() => decodeCursor('!!!')).toThrow();
  });
});
