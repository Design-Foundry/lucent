# `DfMenu` — `<df-menu>`

> The dropdown panel that holds `df-menu-item`s. Rendered into a CDK overlay by
> [`DfMenuTrigger`](./menu-trigger.md); not placed inline.

**Tier:** Container
**Selector:** `df-menu`
**Source:** [`../../menu/menu.ts`](../../menu/menu.ts)

## API

No inputs/outputs. `template: '<ng-content />'`; styling + open/close animation in `menu.scss`
(the trigger toggles a `df-menu--closing` class).

**Content slots:** default — project `df-menu-item`s / `df-menu-divider`s.
**Exported types:** none.

## Usage

```html
<df-icon-button icon="more_vert" ariaLabel="Actions" [dfMenuTrigger]="menu" />
<ng-template #menu>
  <df-menu>
    <df-menu-item icon="edit" label="Rename" />
    <df-menu-divider />
    <df-menu-item icon="delete" variant="danger" label="Delete" />
  </df-menu>
</ng-template>
```

## Composition

- Projection container; pairs with `DfMenuTrigger` (overlay/positioning/dismiss) and
  `df-menu-item` (rows).

## States & accessibility

- The panel itself carries no `role="menu"`; items are `role="menuitem"` but there's no menu
  container role or `aria-activedescendant`/arrow-key roving across items.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ✅ | Projection container |
| §7 a11y | ⚠️ | No `role="menu"` / arrow-key roving on the panel |
| §8 tokens | ✅ | |

## Notes / TODO

- Add `role="menu"` + roving keyboard navigation across items (coordinate like `df-tab-list`).
