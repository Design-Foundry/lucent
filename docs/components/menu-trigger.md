# `DfMenuTrigger` — `[dfMenuTrigger]`

> The directive that opens a `df-menu` in a CDK overlay anchored to the host element. Takes the
> menu's `TemplateRef`.

**Tier:** Container (directive)
**Selector:** `[dfMenuTrigger]`
**Source:** [`../../menu/menu-trigger.ts`](../../menu/menu-trigger.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `dfMenuTrigger` | input (required) | `TemplateRef<void>` | — | The `<ng-template>` wrapping the `df-menu` |
| `dfMenuPosition` | input | `'bottom-end' \| 'bottom-start'` | `'bottom-end'` | Anchor corner |

**Exported types:** none (the `MenuPosition` union is internal).

## Usage

```html
<df-icon-button icon="more_vert" ariaLabel="Actions" [dfMenuTrigger]="menu" dfMenuPosition="bottom-start" />
<ng-template #menu><df-menu>…</df-menu></ng-template>
```

## Composition

- Opens/closes on click + Enter/Space; closes on outside pointer, Escape, or any click inside
  the overlay. Animated close (`df-menu--closing`, ~120 ms) before teardown. Cleans up on
  destroy.

## States & accessibility

- Sets `cursor: pointer`. **Missing:** `aria-haspopup="menu"`, `aria-expanded`, and
  `aria-controls` on the trigger (compare `df-select`, which does this for its listbox).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §4 signal inputs | ✅ | `input.required` / `input` |
| §7 a11y | ⚠️ | No `aria-haspopup`/`aria-expanded` on the trigger |
| §8 tokens | ✅ | |

## Notes / TODO

- Add `aria-haspopup`/`aria-expanded`/`aria-controls`; expose `MenuPosition` or widen
  positions. Consider focus-moving into the menu on open.
