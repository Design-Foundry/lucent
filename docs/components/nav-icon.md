# `DfNavIcon` — `<df-nav-icon>`

> An icon-only navigation item for the nav rail. Holds active/disabled state; renders a large
> `df-icon`.

**Tier:** Navigation
**Selector:** `df-nav-icon`
**Source:** [`../../nav-icon/nav-icon.ts`](../../nav-icon/nav-icon.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `name` | input | `string` | `'widgets'` | Icon glyph — **inconsistent name** (should be `icon`) |
| `active` | input | `boolean` | `false` | Current item — means "chosen" (should be `selected`) |
| `disabled` | input | `boolean` | `false` | |
| `ariaLabel` | input | `string` | `''` | Accessible name (required — icon-only) |

**Content slots:** none.
**Exported types:** none.

## Usage

```html
<df-nav-rail>
  <df-nav-icon name="dashboard" ariaLabel="Dashboard" [active]="true" />
  <df-nav-icon name="folder" ariaLabel="Projects" />
</df-nav-rail>
```

## Composition

- Renders `df-icon` at `size="lg"`. Designed to sit inside `df-nav-rail`.
- Has no click `output` and no `role`/keyboard — interaction is wired by the consumer on the
  host (e.g. routerLink/click). That's a gap for a nav item.

## States & accessibility

- `aria-label` + `title` from `ariaLabel`; `aria-disabled` when disabled.
- **No `role`, `tabindex`, or keyboard** — not keyboard-navigable on its own.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 adornment shorthand | ❌ | Input is `name`, not the kit-standard `icon` ([API-AUDIT §2](../API-AUDIT.md)) |
| §6 state vocab | ❌ | `active` used for "chosen" — should be `selected` ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 output | ⚠️ | No activation output; relies on host wiring |
| §7 a11y | ⚠️ | Labelled, but no role/keyboard for a navigation control |
| §8 tokens | ✅ | |

## Notes / TODO

- Rename `name` → `icon` (alias one minor), `active` → `selected`; add `activated` output +
  `role`/keyboard or document the intended host wiring ([API-PROPOSAL §Rule 2/5](../API-PROPOSAL.md)).
