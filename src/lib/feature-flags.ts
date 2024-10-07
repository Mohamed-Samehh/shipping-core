// Deterministic rollout flag manager. Flags evaluate to a bucket between 0 and
// 1 derived from `fnv1a32(flag + tenantId)`, so a 25% rollout returns a stable
// subset of tenants without coordination.

import { fnv1a32 } from './hash';

export interface FlagDefinition {
  readonly key: string;
  readonly rollout: number; // 0..1
  readonly allowlist?: ReadonlySet<string>;
  readonly denylist?: ReadonlySet<string>;
  readonly defaultValue?: boolean;
}

export class FeatureFlags {
  private readonly defs = new Map<string, FlagDefinition>();

  constructor(definitions: readonly FlagDefinition[] = []) {
    for (const def of definitions) this.register(def);
  }

  register(def: FlagDefinition): void {
    if (def.rollout < 0 || def.rollout > 1) {
      throw new RangeError(`rollout for ${def.key} must be in [0, 1]`);
    }
    this.defs.set(def.key, def);
  }

  isEnabled(key: string, tenantId: string): boolean {
    const def = this.defs.get(key);
    if (!def) return false;
    if (def.denylist?.has(tenantId)) return false;
    if (def.allowlist?.has(tenantId)) return true;
    if (def.rollout >= 1) return true;
    if (def.rollout <= 0) return def.defaultValue ?? false;
    const bucket = fnv1a32(`${key}:${tenantId}`) / 2 ** 32;
    return bucket < def.rollout;
  }

  list(): readonly FlagDefinition[] { return Array.from(this.defs.values()); }
}
