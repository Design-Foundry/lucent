# Calendar

The date-picker atom: a Monday-first month grid with today / selected / range day states. The
Date Picker, Date Range Picker, and the schedulers all build on it. Renders the real dates for a
month; navigation and selection are emitted as events — the calendar itself is presentational
plus the month grid math.

## Where it's named

| Target | Reference | Package |
|---|---|---|
| Angular | `<lucent-calendar>` | `@design-foundry/lucent-angular` |

Underneath, every kit renders the same `.lucent-calendar` structure: `__header` (title +
`__nav` with two icon-buttons) · `__weekdays` (7 × `__weekday`) · `__grid` (42 × `.lucent-day-cell`).

## Anatomy

- **Header** — the `MMMM yyyy` title and prev/next `lucent-icon-button`s (`ghost`, `sm`).
- **Weekday row** — Mon–Sun caption labels.
- **Grid** — a fixed 6×7 grid of day-cell `<button>`s; days from the previous/next month fill the
  edges as `--outside`.

## Day-cell states

| Class | Meaning |
|---|---|
| `.is-today` | Accent ring on today's date. |
| `.is-selected` | Chosen day (single mode) — accent fill. |
| `.is-range-start` / `.is-range-end` | Range endpoints — accent fill, rounded. |
| `.is-range-middle` | Days inside the range — accent-subtle track (tiles edge-to-edge). |
| `.lucent-day-cell--outside` | Day from the adjacent month (muted). |
| `[disabled]` | Outside `min`/`max` — non-interactive. |

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `month` | `Date` | today | Any date within the month to display initially. |
| `value` | `Date` | — | Selected date (single mode); two-way in Blazor via `@bind-Value`. |
| `mode` | `single \| range` | `single` | Selection model. |
| `rangeStart` / `rangeEnd` | `Date` | — | Range endpoints (range mode). |
| `min` / `max` | `Date` | — | Selectable bounds; days outside are disabled. |
| `change` / `onChange` / `changed` / `ValueChanged` | event `Date` | — | Fired on a day click. |
| `monthchange` / `onMonthChange` / `monthChanged` / `MonthChanged` | event `Date` | — | Fired by prev/next. |

Dates are passed as real date objects (JS `Date` / .NET `DateTime`), not attribute strings.

## Composition

Reuses **Icon Button** for the header nav. The Date Picker / Date Range Picker wrap it in a
Floating-UI popover behind a field; the schedulers reuse the day-cell states and grid math.

## Accessibility

- The grid uses `role="grid"` with `role="gridcell"` day buttons and `aria-selected`.
- Prev/next carry accessible names ("Previous month" / "Next month").
- Desktop-first — no minimum target size. Full roving-focus keyboard nav (arrow keys) is a TODO
  shared with the other grid components.

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract, one shared CSS layer | ✅ |
| Real date objects (not stringly-typed) | ✅ |
| Event naming per kit (`change` / `onChange` / `changed` / `ValueChanged`) | ✅ matches kit idiom |
| Reuses Icon Button (no bespoke nav) | ✅ |
| Roving-focus keyboard grid | ⚠️ TODO (shared with List/Table/Piano Roll) |
