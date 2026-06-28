# `DfButton` — `<df-button>`

> The primary action control. Projects its label and optional leading/trailing adornments,
> with built-in loading and disabled states.

**Tier:** Interactive
**Selector:** `df-button`
**Source:** [`../../button/button.ts`](../../button/button.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `ButtonVariant` | `'primary'` | Host class `df-button--<variant>` |
| `size` | input | `ControlSize` | `'md'` | Density scale (`xs/sm/md/lg`); roomier inline padding than fields |
| `loading` | input | `boolean` | `false` | Shows a spinner; also disables the inner `<button>` |
| `disabled` | input | `boolean` | `false` | |
| `type` | input | `'button' \| 'submit' \| 'reset'` | `'button'` | Forwarded to the inner `<button>` |
| `clicked` | output | `MouseEvent` | — | Emitted on click (not `(click)`) |

**Content slots:** default = label · `[dfPrefix]` (leading) · `[dfSuffix]` (trailing).
**Exported types:** `ButtonVariant = 'primary' \| 'secondary' \| 'ghost' \| 'on-glass' \| 'danger' \| 'text'`

## Usage

```html
<df-button (clicked)="save()">Save</df-button>
<df-button variant="danger" [loading]="deleting()">Delete</df-button>
<df-button variant="ghost"><df-icon dfPrefix name="add" /> New</df-button>
```

> Emits **`(clicked)`**, not `(click)` — a frequent gotcha.

## Composition

- Wraps a native `<button>` (`df-button__inner`); forwards `type`/`disabled`.
- Adornments via projection (`dfPrefix`/`dfSuffix`).
- Loading spinner is the `.df-spinner` **CSS class**, not a component (see spinner gap,
  [API-AUDIT §6](../API-AUDIT.md)).

## States & accessibility

- `loading` and `disabled` both disable the inner button.
- Relies on the native button for focus/keyboard/role — correct.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ⚠️ | Projects label (good) but **no `label` shorthand** for data-driven use |
| §5 adornments | ⚠️ | Uses legacy `dfPrefix`/`dfSuffix`; should move to `dfLeading`/`dfTrailing` ([API-AUDIT §2](../API-AUDIT.md)) |
| §4 output naming | ✅ | `clicked` (past-tense) |
| §6 disabled | ✅ | Standalone `disabled` input |
| §10 density | ✅ | On the shared `ControlSize` scale |
| §7 a11y | ✅ | Native `<button>` |
| §8 tokens | ✅ | |

## Notes / TODO

- Add `label` shorthand; migrate adornment slots to `dfLeading`/`dfTrailing`.
- Replace the `.df-spinner` class with a real spinner component.
