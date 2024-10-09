// State-machine workflow helper. Each entity that has a lifecycle (shipment,
// manifest, return, pickup) declares its transitions once and the service
// asks `workflow.transition(state, event)` before mutating.

export interface Transition<S, E> {
  readonly from: S;
  readonly event: E;
  readonly to: S;
}

export class Workflow<S extends string, E extends string> {
  private readonly index = new Map<string, S>();
  constructor(transitions: readonly Transition<S, E>[]) {
    for (const t of transitions) this.index.set(`${t.from}::${t.event}`, t.to);
  }

  next(state: S, event: E): S | undefined {
    return this.index.get(`${state}::${event}`);
  }

  transition(state: S, event: E): S {
    const next = this.next(state, event);
    if (!next) throw new RangeError(`workflow: ${state} cannot accept ${event}`);
    return next;
  }

  canTransition(state: S, event: E): boolean {
    return this.index.has(`${state}::${event}`);
  }

  allowedEvents(state: S): E[] {
    const out: E[] = [];
    for (const key of this.index.keys()) {
      const [from, evt] = key.split('::');
      if (from === state) out.push(evt as E);
    }
    return out;
  }
}
