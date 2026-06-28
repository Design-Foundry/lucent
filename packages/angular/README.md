# @design-foundry/lucent (Angular kit)

The original Lucent component kit, in Angular. **Parked as reference** — Hub will
re-consume it after its rewrite. Not actively built or published right now.

`src/` is the verbatim kit harvested from `hub/`. Components reference the shared
tokens in `tokens/` as runtime CSS variables and emit the semantic class names
documented in `docs/`.

`package.json` is `"private": true` at `0.0.0-dev` — flip to publish only at
**v1.0.0** (`@design-foundry/lucent` on npm). Build tooling (ng-packagr) is added
when the kit is un-parked.
