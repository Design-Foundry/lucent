# Lucent

Design Foundry's design system — shared across the suite's apps.

## Distribution

Private during development. The package names are **reserved** on npm and NuGet to
hold the namespace, but **nothing is published until v1.0.0**.

| Consumer | Target package | Status |
|---|---|---|
| Angular (Hub) | `@design-foundry/lucent` (npm) | reserved, unpublished |
| Razor / Blazor (Account) | `DesignFoundry.Lucent` (NuGet) | reserved, unpublished |

Until 1.0.0, consumers reference Lucent locally (path / project reference or a
local pack), not via a published package.

The framework-neutral core (design **tokens**, the **CSS** layer keyed to semantic
class names, and the **spec docs**) is shared. Each framework ships its own
component implementation against that contract and emits identical class names, so
a single CSS layer styles both.

## Status

**Rescue snapshot.** `design-system/` is a verbatim harvest of the Angular kit out
of `hub/` (taken before Hub's rewrite, including in-flight foundations work:
`sizing.ts` / `tone.ts` / `_controls.scss` density + tone scales and the `docs/`
spec set). Not yet restructured.

### Next

- [ ] Restructure into `tokens/`, `css/`, `docs/`, `packages/angular`, `packages/razor`.
- [ ] Build the Razor Class Library (`DesignFoundry.Lucent`) — Account is the first consumer.
- [ ] Publishing (npm + NuGet) is deferred to **v1.0.0** — no publish pipeline until then.
