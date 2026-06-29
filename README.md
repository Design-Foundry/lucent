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

The framework-neutral core (design **tokens** + the **component CSS** layer keyed to
semantic class names, under `styles/`, plus the **spec docs**) is shared. It's plain
CSS — no SCSS, no build step. Each framework ships its own component implementation
against that contract and emits identical class names, so a single CSS layer styles both.

## Layout

```
styles/              shared framework-neutral base — plain CSS (tokens + component styles)
  lucent.css           single entry; @imports everything in cascade order
  tokens/              design tokens as CSS custom properties (primitive → semantic + control alias)
  components/          component styles keyed to df- class names (filled per-component)
docs/                framework-neutral spec — API, conventions, foundations, per-component behavior
packages/
  angular/           @design-foundry/lucent — Angular kit, parked reference (harvested from hub/)
  razor/             DesignFoundry.Lucent — Razor RCL (Account's first consumer)
```

The shared base (`styles/` + `docs/`) is framework-neutral. Each package implements
components against it and emits **identical class names**, so one CSS layer styles
both. See [styles/README.md](./styles/README.md).

### Next

- [x] Restructure into `styles/` (tokens + components), `docs/`, `packages/angular`, `packages/razor`.
- [x] Drop SCSS — the base is plain CSS, shipped as-is (no build toolchain).
- [x] Extract the first components (button, input) from the Angular kit into `styles/components/`.
- [x] Build out the Razor Class Library components (`DesignFoundry.Lucent`) — full kit ported (30 components), each verified in the Blazor showcase (`samples/DesignFoundry.Lucent.Showcase`) in light + dark.
- [x] Extract per-component CSS into `styles/components/` for every component (the shared contract both kits emit).
- [ ] Retrofit the Angular kit onto the shared `styles/` contract (emit `lucent-` classes, drop the per-component `:host`/`df-` SCSS).
- [ ] React package (`packages/react`) — build from scratch against the same CSS contract.
- [ ] Publishing (npm + NuGet) is deferred to **v1.0.0** — no publish pipeline until then.
