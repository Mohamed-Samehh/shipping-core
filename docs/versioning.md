# Versioning

shipping-core follows
[Semantic Versioning](https://semver.org/) at the public-barrel surface
(`src/index.ts`).

## What is breaking

- Removing a public export.
- Renaming a public export.
- Changing a public function signature (param count, types, return type).
- Changing an enum literal's set of values.
- Tightening a zod schema in a way that previously valid inputs now fail.

A *breaking* change requires a major version bump.

## What is additive

- New exports.
- New optional fields on entities.
- New methods on existing services.
- New domain entities.

These warrant a *minor* version bump.

## What is a patch

- Bug fixes that bring behaviour into line with documented contracts.
- Type tightening that previously *passed* an obviously-incorrect input
  silently.
- Performance improvements with no observable behaviour change.

## Deprecation

When we need to remove an export, we go through a deprecation cycle:

1. Mark the export with `@deprecated` JSDoc in one release.
2. Continue exporting the old surface alongside the new one for one
   minor release minimum.
3. Remove in the next major release.

We do not silently change behaviour. If the change is observable from
outside the library, it goes through the cycle.

## Pre-1.0 caveats

shipping-core is still pre-1.0 (current version 0.4.0). The above rules
apply, but the bar for a breaking change is lower while we shake out the
public surface. Watch the CHANGELOG.
