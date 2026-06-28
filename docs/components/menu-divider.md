# `DfMenuDivider` — `<df-menu-divider>`

> A separator between groups of `df-menu-item`s. Empty element styled by SCSS.

**Tier:** Container
**Selector:** `df-menu-divider`
**Source:** [`../../menu-divider/menu-divider.ts`](../../menu-divider/menu-divider.ts)

## API

No inputs/outputs; `template: ''`.

**Content slots:** none.
**Exported types:** none.

## Usage

```html
<df-menu>
  <df-menu-item icon="edit" label="Rename" />
  <df-menu-divider />
  <df-menu-item icon="delete" variant="danger" label="Delete" />
</df-menu>
```

## Composition

- Functionally identical to [`df-nav-divider`](./nav-divider.md) — a candidate to unify into a
  single `df-divider` ([API-AUDIT §6](../API-AUDIT.md)).

## States & accessibility

- Decorative; no `role="separator"`.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| component scope | ⚠️ | Duplicates `df-nav-divider` |
| §7 a11y | ⚠️ | No `role="separator"` |
| §8 tokens | ✅ | |

## Notes / TODO

- Unify the divider components into one configurable `df-divider`.
