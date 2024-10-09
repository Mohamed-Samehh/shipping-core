import { Workflow } from '../../src/lib/workflow';

describe('Workflow', () => {
  type S = 'draft' | 'booked' | 'cancelled';
  type E = 'book' | 'cancel';

  const w = new Workflow<S, E>([
    { from: 'draft', event: 'book', to: 'booked' },
    { from: 'draft', event: 'cancel', to: 'cancelled' },
    { from: 'booked', event: 'cancel', to: 'cancelled' },
  ]);

  test('next returns target state', () => {
    expect(w.next('draft', 'book')).toBe('booked');
  });

  test('next undefined for unknown transition', () => {
    expect(w.next('cancelled', 'book')).toBeUndefined();
  });

  test('transition throws on invalid transition', () => {
    expect(() => w.transition('cancelled', 'book')).toThrow();
  });

  test('canTransition reports validity', () => {
    expect(w.canTransition('draft', 'book')).toBe(true);
    expect(w.canTransition('cancelled', 'book')).toBe(false);
  });

  test('allowedEvents lists events from a state', () => {
    expect(w.allowedEvents('draft').sort()).toEqual(['book', 'cancel']);
  });
});
