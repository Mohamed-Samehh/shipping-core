# Release checklist

Pre-release walkthrough for shipping-core minor and patch releases.

## Local

- [ ] `git switch main` and `git pull --ff-only`.
- [ ] `npm install` (refresh node_modules from the lockfile).
- [ ] `npm run typecheck` -- no errors.
- [ ] `npm run lint` -- no errors.
- [ ] `npm test -- --colors=false` -- all 800+ tests pass.
- [ ] `npm run build` -- `dist/` populates without errors.

## Versioning

- [ ] Bump `package.json` `version` per semver rules
      (see `docs/versioning.md`).
- [ ] Add a new `## X.Y.Z -- YYYY-MM-DD` section to `CHANGELOG.md`
      with **Added / Changed / Fixed / Internal** subsections.
- [ ] For minor releases: write a long-form retrospective in
      `docs/release-history.md`.

## Surface review

- [ ] Diff `src/index.ts` against the previous release tag.
- [ ] Every new export has a JSDoc comment.
- [ ] No exports were removed without a deprecation cycle.
- [ ] Schema diffs in `src/domain/*` are additive (optional fields,
      defaults) -- not breaking.

## Documentation

- [ ] `docs/api-reference.md` updated with any new public exports.
- [ ] `docs/recipes.md` extended if the new release ships a recipe-
      worthy feature.
- [ ] `docs/migration.md` extended with upgrade notes if the release
      changes any externally visible behaviour.

## Build artifacts

- [ ] Tag the commit: `git tag v$VERSION`.
- [ ] Push the tag: `git push origin v$VERSION`.
- [ ] CI publishes the build artifact and uploads it to the internal
      package registry.

## Post-release

- [ ] Announce in `#helix-shipping` Slack with the changelog excerpt
      and a one-line migration summary.
- [ ] Open a follow-up PR bumping `version` to the next dev marker
      (`X.Y.Z+1-dev`).
- [ ] Watch the build / acceptance dashboard for 24 hours; revert
      and patch if any downstream consumer reports a regression.
