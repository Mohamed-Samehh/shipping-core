import { TypedEmitter } from '../../src/lib/events';

describe('TypedEmitter', () => {
  type M = { ping: { msg: string }; pong: number };

  test('emit fans out to subscribers in order', async () => {
    const e = new TypedEmitter<M>();
    const order: string[] = [];
    e.on('ping', (p) => { order.push('a:' + p.msg); });
    e.on('ping', (p) => { order.push('b:' + p.msg); });
    await e.emit('ping', { msg: 'hi' });
    expect(order).toEqual(['a:hi', 'b:hi']);
  });

  test('off removes a listener', async () => {
    const e = new TypedEmitter<M>();
    const a = (p: M['ping']) => { void p; };
    const off = e.on('ping', a);
    off();
    expect(e.listenerCount('ping')).toBe(0);
  });

  test('throws by default if a listener rejects', async () => {
    const e = new TypedEmitter<M>();
    e.on('ping', async () => { throw new Error('boom'); });
    await expect(e.emit('ping', { msg: 'x' })).rejects.toThrow('boom');
  });

  test('onError swallows listener errors', async () => {
    const captured: string[] = [];
    const e = new TypedEmitter<M>({ onError: (err) => { captured.push((err as Error).message); } });
    e.on('ping', () => { throw new Error('boom'); });
    await e.emit('ping', { msg: 'x' });
    expect(captured).toEqual(['boom']);
  });

  test('removeAll clears all listeners for an event', () => {
    const e = new TypedEmitter<M>();
    e.on('ping', () => {});
    e.on('ping', () => {});
    e.removeAll('ping');
    expect(e.listenerCount('ping')).toBe(0);
  });
});
