// Typed, async event emitter used for in-process side-effect fan-out (audit
// hooks, metrics taps, webhook enqueueing). Subscribers are awaited in
// registration order so failures surface in tests.

export type Listener<T> = (event: T) => void | Promise<void>;

export interface EventsOptions {
  onError?: (error: unknown, eventName: string) => void;
}

export class TypedEmitter<EventMap extends Record<string, unknown>> {
  private readonly listeners = new Map<keyof EventMap, Set<Listener<unknown>>>();
  private readonly onError?: EventsOptions['onError'];

  constructor(options: EventsOptions = {}) {
    if (options.onError !== undefined) this.onError = options.onError;
  }

  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): () => void {
    let set = this.listeners.get(event);
    if (!set) { set = new Set(); this.listeners.set(event, set); }
    set.add(listener as Listener<unknown>);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  async emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): Promise<void> {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of set) {
      try { await listener(payload); }
      catch (error) {
        if (this.onError) this.onError(error, String(event));
        else throw error;
      }
    }
  }

  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  removeAll<K extends keyof EventMap>(event?: K): void {
    if (event === undefined) this.listeners.clear();
    else this.listeners.delete(event);
  }
}
