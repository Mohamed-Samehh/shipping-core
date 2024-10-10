// Minimal FIFO queue plus a priority queue (binary heap). The webhook
// dispatcher and the pickup scheduler both use these instead of `Array.shift()`
// to keep enqueue / dequeue O(1) and O(log n) respectively.

export class Queue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined;
    const item = this.items[this.head] as T;
    this.items[this.head] = undefined as unknown as T;
    this.head += 1;
    if (this.head > 32 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return item;
  }
  peek(): T | undefined { return this.items[this.head]; }
  size(): number { return this.items.length - this.head; }
  toArray(): T[] { return this.items.slice(this.head); }
  clear(): void { this.items = []; this.head = 0; }
}

export class PriorityQueue<T> {
  private heap: T[] = [];
  constructor(private readonly compare: (a: T, b: T) => number) {}

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0] as T;
    const last = this.heap.pop() as T;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  peek(): T | undefined { return this.heap[0]; }
  size(): number { return this.heap.length; }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.heap[i] as T, this.heap[parent] as T) >= 0) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent] as T, this.heap[i] as T];
      i = parent;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.compare(this.heap[left] as T, this.heap[smallest] as T) < 0) smallest = left;
      if (right < n && this.compare(this.heap[right] as T, this.heap[smallest] as T) < 0) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest] as T, this.heap[i] as T];
      i = smallest;
    }
  }
}
