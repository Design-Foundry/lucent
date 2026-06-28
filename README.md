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

## Layout

```
tokens/              shared design tokens (SCSS → CSS custom properties)
css/                 shared component CSS, keyed to semantic class names (empty; filled per-component)
docs/                framework-neutral spec — API, conventions, foundations, per-component behavior
packages/
  angular/           @design-foundry/lucent — Angular kit, parked reference (harvested from hub/)
  razor/             DesignFoundry.Lucent — Razor RCL scaffold (Account's first consumer)
```

The shared core (`tokens/` + `css/` + `docs/`) is framework-neutral. Each package
implements components against it and emits **identical class names**, so one CSS
layer styles both.

### Next

- [x] Restructure into `tokens/`, `css/`, `docs/`, `packages/angular`, `packages/razor`.
- [ ] Build out the Razor Class Library components (`DesignFoundry.Lucent`) — Account is the first consumer.
- [ ] Extract per-component CSS from the Angular kit into `css/` as Razor counterparts are built.
- [ ] Publishing (npm + NuGet) is deferred to **v1.0.0** — no publish pipeline until then.
