import { throttle, debounce } from '../../src/lib/throttle';

describe('throttle', () => {
  test('drops calls inside the window', () => {
    let now = 0;
    const fn = jest.fn();
    const t = throttle(fn, 100, () => now);
    t();
    t();
    expect(fn).toHaveBeenCalledTimes(1);
    now = 200;
    t();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('reset re-arms', () => {
    let now = 0;
    const fn = jest.fn();
    const t = throttle(fn, 100, () => now);
    t();
    t.reset();
    t();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('rejects zero interval', () => {
    expect(() => throttle(() => 1, 0)).toThrow();
  });
});

describe('debounce', () => {
  jest.useFakeTimers();
  test('only the last call fires', () => {
    const fn = jest.fn();
    const d = debounce(fn, 20);
    d();
    d();
    d();
    jest.advanceTimersByTime(25);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('cancel prevents firing', () => {
    const fn = jest.fn();
    const d = debounce(fn, 20);
    d();
    d.cancel();
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
  });
});
