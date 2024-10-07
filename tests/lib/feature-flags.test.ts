import { FeatureFlags } from '../../src/lib/feature-flags';

describe('FeatureFlags', () => {
  test('rollout 0 returns defaultValue', () => {
    const ff = new FeatureFlags([{ key: 'k', rollout: 0, defaultValue: true }]);
    expect(ff.isEnabled('k', 't1')).toBe(true);
  });

  test('rollout 1 enables everyone', () => {
    const ff = new FeatureFlags([{ key: 'k', rollout: 1 }]);
    expect(ff.isEnabled('k', 't1')).toBe(true);
    expect(ff.isEnabled('k', 't2')).toBe(true);
  });

  test('partial rollout is deterministic per tenant', () => {
    const ff = new FeatureFlags([{ key: 'k', rollout: 0.5 }]);
    const a = ff.isEnabled('k', 't1');
    expect(ff.isEnabled('k', 't1')).toBe(a);
  });

  test('allowlist forces enabled', () => {
    const ff = new FeatureFlags([{ key: 'k', rollout: 0, allowlist: new Set(['vip']) }]);
    expect(ff.isEnabled('k', 'vip')).toBe(true);
  });

  test('denylist forces disabled', () => {
    const ff = new FeatureFlags([{ key: 'k', rollout: 1, denylist: new Set(['banned']) }]);
    expect(ff.isEnabled('k', 'banned')).toBe(false);
  });

  test('rejects out-of-range rollout', () => {
    expect(() => new FeatureFlags([{ key: 'k', rollout: 2 }])).toThrow();
  });
});
