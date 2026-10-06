# `DfIconButton` — `<df-icon-button>`

> An icon-only button. Same variants as `df-button`, sized `sm`/`md`/`lg`, with a required
> accessible label.

**Tier:** Interactive
**Selector:** `df-icon-button`
**Source:** [`../../icon-button/icon-button.ts`](../../icon-button/icon-button.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `icon` | input | `string` | `''` | Material Icons name (the kit-standard `icon` shorthand) |
| `variant` | input | `ButtonVariant` | `'primary'` | Reuses `df-button`'s variants |
| `size` | input | `IconButtonSize` | `'md'` | Drives icon size + spinner diameter |
| `loading` | input | `boolean` | `false` | |
| `disabled` | input | `boolean` | `false` | |
| `type` | input | `'button' \| 'submit' \| 'reset'` | `'button'` | |
| `ariaLabel` | input | `string` | `''` | **Set this** — icon-only buttons have no text |
| `clicked` | output | `MouseEvent` | — | |

**Content slots:** none (icon-only).
**Exported types:** `IconButtonSize = 'sm' \| 'md' \| 'lg'`

## Usage

```html
<df-icon-button icon="more_vert" ariaLabel="Actions" variant="text" />
<df-icon-button icon="delete" ariaLabel="Delete" variant="danger" [loading]="busy()" />
```

## Composition

- Renders an internal `df-icon` (size mapped from `size`), reuses `ButtonVariant` from
  `df-button`. Common trailing adornment in `df-list-item` rows.

## States & accessibility

- `ariaLabel` is the only accessible name — omitting it makes the control unlabelled. Consider
  pairing with `dfTooltip` for a visible hint.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 adornment shorthand | ✅ | Uses `icon` (the correct name) |
| §4 output naming | ✅ | `clicked` |
| §6 disabled | ✅ | Standalone input |
| §7 a11y | ⚠️ | Correct mechanism, but `ariaLabel` isn't enforced — easy to ship unlabelled |
| §8 tokens | ✅ | |

## Notes / TODO

- Consider a dev-time warning when `ariaLabel` is empty.
