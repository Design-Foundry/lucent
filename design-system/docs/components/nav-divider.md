# `DfNavDivider` — `<df-nav-divider>`

> A visual separator inside `df-nav-rail`. Empty element styled by SCSS.

**Tier:** Navigation
**Selector:** `df-nav-divider`
**Source:** [`../../nav-divider/nav-divider.ts`](../../nav-divider/nav-divider.ts)

## API

No inputs/outputs; `template: ''` — purely a styled host.

**Content slots:** none.
**Exported types:** none.

## Usage

```html
<df-nav-rail>
  <df-nav-icon name="dashboard" ariaLabel="Dashboard" />
  <df-nav-divider />
  <df-nav-icon name="settings" ariaLabel="Settings" />
</df-nav-rail>
```

## Composition

- One of **three** divider components (`df-nav-divider`, `df-menu-divider`, plus dividers
  baked into other layouts) — there is no single general `df-divider` ([API-AUDIT §6](../API-AUDIT.md)).

## States & accessibility

- Decorative; no role. (A general divider should expose `role="separator"`.)

## Conventions check

| Rule | Status | Note |
|---|---|---|
| component scope | ⚠️ | Duplicates `df-menu-divider`; candidate to unify into one `df-divider` |
| §7 a11y | ⚠️ | No `role="separator"` |
| §8 tokens | ✅ | |

## Notes / TODO

- Fold the divider variants into one configurable `df-divider` (orientation/inset).
