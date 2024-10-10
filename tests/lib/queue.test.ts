import { Queue, PriorityQueue } from '../../src/lib/queue';

describe('Queue', () => {
  test('FIFO order', () => {
    const q = new Queue<number>();
    q.enqueue(1); q.enqueue(2); q.enqueue(3);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.size()).toBe(1);
  });

  test('dequeue from empty returns undefined', () => {
    expect(new Queue<number>().dequeue()).toBeUndefined();
  });

  test('peek does not remove', () => {
    const q = new Queue<number>();
    q.enqueue(1);
    expect(q.peek()).toBe(1);
    expect(q.size()).toBe(1);
  });

  test('clear empties the queue', () => {
    const q = new Queue<number>();
    q.enqueue(1); q.enqueue(2);
    q.clear();
    expect(q.size()).toBe(0);
  });
});

describe('PriorityQueue', () => {
  test('pops smallest first under min-compare', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    [5, 1, 3, 4, 2].forEach((n) => pq.push(n));
    const out: number[] = [];
    while (pq.size() > 0) out.push(pq.pop() as number);
    expect(out).toEqual([1, 2, 3, 4, 5]);
  });

  test('pop from empty returns undefined', () => {
    expect(new PriorityQueue<number>((a, b) => a - b).pop()).toBeUndefined();
  });
});
