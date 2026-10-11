# Angular retrofit — onto the shared `styles/` contract

The Angular kit was harvested from `hub/` with **per-component encapsulated SCSS** (`:host` +
`df-` BEM classes). The shared base in [`styles/`](../styles/) now owns every component's CSS,
keyed to the **`lucent-` class contract** that the Razor kit already emits. Retrofitting Angular
means: emit the `lucent-` classes, and delete the per-component SCSS so one CSS layer styles both
kits.

> **Status: COMPLETE (2026-06-29).** All ~30 components retrofitted onto the `lucent-` contract;
> every per-component `.scss` deleted (the kit now ships **zero SCSS**). Verified in the showcase in
> light + dark, including the interactive overlays (select, menu, modal). The recipe below is kept
> as the reference for future components. Two notes: `df-input` → **`lucent-text-input`** is the one
> block-name change (it shares the Razor `LucentTextInput` contract); the `lucent-spinner` in
> button/icon-button is an intentional gap — undefined in *both* kits (see API-AUDIT §5).

> **Verification (in-repo).** `packages/angular` is now a **real, buildable Angular library**
> (ng-packagr → `dist/lucent`, packs to npm) inside a workspace that also hosts the
> **`samples/lucent-angular-showcase`** app — the Angular analog of
> `samples/DesignFoundry.Lucent.Showcase`. Verify every retrofit here, in both themes, exactly as
> the Razor kit was verified:
>
> ```bash
> npm install              # once
> npm run lib:build        # ng build lucent  → ng-packagr, must stay green
> npm run showcase         # ng serve         → http://localhost:4200 (CI used :4280)
> #   ?theme=light / ?theme=dark drive <html data-theme> for screenshots
> npm run lib:pack         # optional — produce the npm tarball (dist/lucent/*.tgz)
> ```
>
> The showcase consumes the library **by source** via a TS path alias
> (`@design-foundry/lucent-angular` → `packages/angular/src/index.ts` in the root `tsconfig.json`) — the
> dev-loop analog of a .NET `ProjectReference`, so edits show up on save with no pack/install step.
> A component still on `df-` classes renders via its own (parked) SCSS; once retrofitted it drops
> the SCSS and picks up the shared `styles/lucent.css` — so the showcase shows each component
> before *and* after, which is the verification.

## The recipe (per component)

For `packages/angular/src/<name>/`:

1. **Host classes → `lucent-`.** In the `@Component` `host` block, rename the `df-<name>--…`
   classes to `lucent-<name>--…` **and add the base `lucent-<name>` class** (the old SCSS styled
   the bare `:host`; the shared CSS targets the `.lucent-<name>` class, so the host element must
   carry it now).
2. **Template classes → `lucent-`.** In `<name>.html`, rename every `df-<name>__el` /
   `df-<name>--mod` to its `lucent-` equivalent. The element/structure stays identical — only the
   class strings change (the shared CSS was ported 1:1 from the SCSS).
3. **Drop the SCSS.** Remove `styleUrl: './<name>.scss'` from the decorator and delete
   `<name>.scss`. Styling now comes from the global `styles/lucent.css` the consuming app loads.
   (Default `ViewEncapsulation.Emulated` is fine — it only scopes a component's *own* styles;
   global classes still apply.)
4. **No API change.** Inputs/outputs/selectors are untouched — only the emitted CSS classes move
   from `df-` to `lucent-`. Consumers that targeted `df-` classes in their own CSS must update
   (call this out in the changelog).

A few components keep extra structure the Razor port omitted (e.g. button's `__label` span,
the `is-loading`/`df-spinner` branch). Leave that markup; the shared CSS simply doesn't style the
extras (the spinner was already undefined — a pre-existing gap, see API-AUDIT §5).

## Worked example — `button`

`button.ts` (decorator):

```ts
// before
styleUrl: './button.scss',
host: { '[class]': '"df-button--" + variant() + " df-button--" + size()', '[class.is-loading]': 'loading()' }

// after — no styleUrl; base class added; df- → lucent-
host: { '[class]': '"lucent-button lucent-button--" + variant() + " lucent-button--" + size()', '[class.is-loading]': 'loading()' }
```

`button.html`: `df-button__inner` → `lucent-button__inner`, `df-button__label` → `lucent-button__label`.

`button.scss`: **deleted.**

Result: `<df-button>` renders `<… class="lucent-button lucent-button--primary lucent-button--md"><button class="lucent-button__inner">…`, styled entirely by `styles/components/button.css` — the exact markup that file's header documents.

## Order

Follow the same dependency order the Razor port used (foundations/primitives first): `icon`,
`tag`, `status-tag`, `tooltip` → `icon-button`, `toggle`, `chip`, `checkbox` → nav (`nav-icon`,
`nav-rail`, `nav-divider`, `activity-bar`, `breadcrumbs`) → `avatar`, `inline-input`, `option`,
`select`, `input` → `list-item`, `list` → `tab`, `tab-list`, `card`, `menu*`, `modal` →
`snackbar`, `toast`. Each component's shared CSS already exists in `styles/components/`.

## Class-name index

Every `df-<x>` block in a template maps to `lucent-<x>` with the **same** element/modifier suffix.
There are no renames beyond the `df-` → `lucent-` prefix (the contract rename was done in
`styles/` already — commit `e5ba1a7`). When in doubt, open the matching
`styles/components/<name>.css` — its header documents the exact class structure both kits emit.
