import { clamp, lerp, ceilToStep, floorToStep, roundHalfEven, sum, average, median, gcd, lcm } from '../../src/lib/maths';

describe('maths', () => {
  test('clamp bounds value', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });

  test('lerp interpolates', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  test('ceilToStep / floorToStep', () => {
    expect(ceilToStep(7, 5)).toBe(10);
    expect(floorToStep(7, 5)).toBe(5);
  });

  test('roundHalfEven', () => {
    expect(roundHalfEven(2.5)).toBe(2);
    expect(roundHalfEven(3.5)).toBe(4);
  });

  test('sum / average', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(average([1, 2, 3])).toBe(2);
  });

  test('median odd / even length', () => {
    expect(median([1, 3, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  test('gcd / lcm', () => {
    expect(gcd(12, 18)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
  });

  test('clamp rejects bad bounds', () => {
    expect(() => clamp(1, 3, 1)).toThrow();
  });
});
