# Date Range Picker

A field that opens the [Calendar](./calendar.md) in **range mode** to choose a start–end date pair.
It shares the [Date Picker](./date-picker.md)'s field + popover shell (`.lucent-date-picker`); the
first click sets the start, the second sets the end, and the endpoints are normalized so the start
is never after the end.

## Where it's named

| Target | Reference | Package |
|---|---|---|
| Angular | `<lucent-date-range-picker>` | `@design-foundry/lucent-angular` |

Reuses the `.lucent-date-picker` structure and CSS: `__label?` · `__trigger` (`date_range` icon +
`__value` + caret) · a `.lucent-date-picker__popover` wrapping a range-mode `.lucent-calendar`.

## Value formatting

The trigger shows a compact range that omits redundant parts:

| Case | Example |
|---|---|
| Same month | `Jul 9 – 12, 2026` |
| Same year, different month | `Sep 28 – Oct 3, 2026` |
| Different years | `Dec 30, 2025 – Jan 2, 2026` |

While selecting (start chosen, end pending) the field shows just the start date.

## Selection model

- First click (or after a completed range) sets a fresh **start** and clears the end.
- Second click sets the **end**; if it falls before the start, the two swap so `start ≤ end`.
- On completion the picker emits the range and closes; the Calendar highlights the in-progress
  range live (`is-range-start` / `is-range-middle` / `is-range-end`).

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` / `start` + `end` | `{ start, end }` | — | Selected range. Two-way in Blazor via `@bind-Value`, in Angular via `[(value)]`; the WC element exposes `start`/`end` properties. |
| `label` | `string` | — | Optional field label. |
| `placeholder` | `string` | `Select dates` | Shown when no range is selected. |
| `size` | `sm \| md \| lg` | `md` | Field density. |
| `min` / `max` | `Date` | — | Selectable bounds; days outside are disabled. |
| `change` / `onChange` / `valueChange` / `ValueChanged` | event `{ start, end }` | — | Fired once both endpoints are chosen. |

The range type is `DateRange` (`{ start: Date; end: Date }` in JS/TS, a `record` in .NET). Endpoints
are real date objects, not attribute strings.

## Composition

Wraps the **Calendar** in `mode="range"` behind the shared Date Picker field, floated with the same
per-kit overlay primitive (Floating UI / CDK overlay / inline-anchored in Blazor).

## Accessibility

- The trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`.
- Dismisses on outside click / Escape.
- Desktop-first; the shared roving-focus keyboard TODO on the Calendar applies here too.

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract (reuses `.lucent-date-picker`) | ✅ |
| Real date objects + shared `DateRange` type | ✅ |
| Endpoints normalized (`start ≤ end`) | ✅ |
| Two-way binding per kit idiom | ✅ |
| Reuses Calendar range mode (no bespoke grid) | ✅ |
