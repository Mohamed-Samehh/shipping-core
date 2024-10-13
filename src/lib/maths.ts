// Pure number helpers used by capacity math, transit-time projections and
// dispatch slot planning. Everything finite-checked.

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) throw new RangeError('value must be finite');
  if (max < min) throw new RangeError('max must be >= min');
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function ceilToStep(value: number, step: number): number {
  if (step <= 0) throw new RangeError('step must be positive');
  return Math.ceil(value / step) * step;
}

export function floorToStep(value: number, step: number): number {
  if (step <= 0) throw new RangeError('step must be positive');
  return Math.floor(value / step) * step;
}

export function roundHalfEven(value: number): number {
  const rounded = Math.round(value);
  if (Math.abs(value - Math.trunc(value)) !== 0.5) return rounded;
  return Math.trunc(value) % 2 === 0 ? Math.trunc(value) : rounded;
}

export function sum(values: readonly number[]): number {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

export function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2 : (sorted[mid] as number);
}

export function gcd(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new RangeError('gcd needs integers');
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y > 0) { [x, y] = [y, x % y]; }
  return x;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}
