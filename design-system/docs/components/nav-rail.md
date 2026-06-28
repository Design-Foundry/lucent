# `DfNavRail` — `<df-nav-rail>`

> The vertical rail container that holds `df-nav-icon`s (and `df-nav-divider`s). Layout only —
> projects its children.

**Tier:** Navigation
**Selector:** `df-nav-rail`
**Source:** [`../../nav-rail/nav-rail.ts`](../../nav-rail/nav-rail.ts)

## API

No inputs/outputs. Template is `<ng-content />`; all styling is in `nav-rail.scss`.

**Content slots:** default — project `df-nav-icon` / `df-nav-divider`.
**Exported types:** none.

## Usage

```html
<df-nav-rail>
  <df-nav-icon name="dashboard" ariaLabel="Dashboard" [active]="true" />
  <df-nav-divider />
  <df-nav-icon name="settings" ariaLabel="Settings" />
</df-nav-rail>
```

## Composition

- Projection container for nav items (the collection-by-projection model, CONVENTIONS §5).
- Does **not** coordinate selection across its items (no active/value model) — each
  `df-nav-icon` carries its own `active`. Compare with `df-tab-list`, which does coordinate.

## States & accessibility

- No `role="navigation"`/`aria` on the rail itself; add landmark semantics at the usage site.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ⚠️ | Projects children (good) but provides no selection coordination |
| §7 a11y | ⚠️ | No navigation landmark role |
| §8 tokens | ✅ | |

## Notes / TODO

- Consider a `[(value)]` + roving-tabindex model like `df-tab-list`, and a `nav` landmark.
