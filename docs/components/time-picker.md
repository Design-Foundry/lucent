# Time Picker

A field that opens a three-column popover — **hour · minute · period** — to pick a time of day.
Each column is a scrolling list of cells; the selected cell in each column reads as
`accent-subtle` filled. Selecting any column commits a complete time (filling unset parts with
sensible defaults) and keeps the popover open so the other columns can be adjusted.

## Where it's named

| Target | Reference | Package |
|---|---|---|
| Angular | `<lucent-time-picker>` | `@design-foundry/lucent-angular` |

Every kit renders the same `.lucent-time-picker` structure: `__label?` · `__trigger` (`schedule`
icon + `__value` + caret) · a `.lucent-time-picker__popover` of three `__col`s, each holding
`__cell` `<button>`s (`.is-selected` on the chosen value).

## Anatomy

- **Trigger** — a field-styled `<button>` (min-width 160px) with a `schedule` leading icon, the
  formatted value (`10:30 AM`) or a muted placeholder, and a caret.
- **Popover** — a raised card of three scrolling columns divided by hairline borders:
  - **Hour** — `1`–`12`.
  - **Minute** — `00`–`55` stepped by `minuteStep` (default `5`).
  - **Period** — `AM` / `PM`.

## Value model

The value is a 24-hour time — `Time` (`{ hours: 0–23, minutes: 0–59 }`) in JS/TS, `TimeOnly` in
.NET. The trigger renders it in 12-hour form with a period. Picking a single column derives a full
time from the current value (or defaults: hour `9`, minute `0`, period `AM`), so the field always
shows a complete, valid time after the first click.

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Time` / `TimeOnly` | — | Selected time; two-way in Blazor via `@bind-Value`, in Angular via `[(value)]`. |
| `label` | `string` | — | Optional field label. |
| `placeholder` | `string` | `Select time` | Shown when no time is selected. |
| `size` | `sm \| md \| lg` | `md` | Field density. |
| `minuteStep` | `number` | `5` | Minute-column granularity. |
| `change` / `onChange` / `valueChange` / `ValueChanged` | event `Time` | — | Fired on each column selection. |

## Composition

Reuses **Icon** for the field glyphs. Unlike the Date Picker, the popover supplies its own raised
surface (it wraps columns, not a Calendar). Floats via each kit's overlay primitive (Floating UI /
CDK overlay / inline-anchored in Blazor).

## Accessibility

- The trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`.
- Each column is a `role="listbox"` with an accessible name (Hour / Minute / Period).
- Dismisses on outside click / Escape.
- Desktop-first — keyboard column navigation is a shared roving-focus TODO.

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract, one shared CSS layer | ✅ |
| Structured time value (`Time` / `TimeOnly`, not stringly-typed) | ✅ |
| Two-way binding per kit idiom | ✅ |
| Selected cell = `accent-subtle` (token, not hardcoded) | ✅ |
| Reuses Icon; popover floats via native overlay | ✅ |
