# Date Picker

A field that opens the [Calendar](./calendar.md) in a floating popover to choose a single date.
The trigger shows a calendar icon, the formatted value (or a placeholder), and a caret; clicking
it floats a Calendar, and picking a day sets the value and closes the popover.

## Where it's named

| Target | Reference | Package |
|---|---|---|
| Angular | `<lucent-date-picker>` | `@design-foundry/lucent-angular` |

Every kit renders the same `.lucent-date-picker` structure: `__label?` · `__trigger` (button:
`__icon` + `__value` + `__caret`) · a `.lucent-date-picker__popover` wrapping a `.lucent-calendar`.

## Anatomy

- **Trigger** — a field-styled `<button>` (`surface-glass`, `border-default`, `radius-md`) sized by
  `size` (`sm`/`md`/`lg`), carrying a `calendar_today` leading icon and an `arrow_drop_down` caret.
- **Value** — the selected date formatted `MMM d, yyyy` (e.g. `Jul 20, 2026`), or the muted
  placeholder when empty.
- **Popover** — the Calendar floated below the field, elevated with `--shadow-lg`.

## How the popover floats (per kit)

The Calendar carries its own surface; the popover only adds elevation. Each kit anchors it the
idiomatic way:

| Kit | Mechanism |
|---|---|
| Angular | CDK `cdkConnectedOverlay` (same overlay the Select uses), outside-click dismiss. |

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date` | — | Selected date; two-way in Blazor via `@bind-Value`, in Angular via `[(value)]`. |
| `label` | `string` | — | Optional field label. |
| `placeholder` | `string` | `Select date` | Shown when no date is selected. |
| `size` | `sm \| md \| lg` | `md` | Field density. |
| `min` / `max` | `Date` | — | Selectable bounds; days outside are disabled in the Calendar. |
| `change` / `onChange` / `valueChange` / `ValueChanged` | event `Date` | — | Fired when a day is chosen. |

Dates are real date objects (JS `Date` / .NET `DateTime`), not attribute strings.

## Composition

Wraps the **Calendar** (which reuses **Icon Button** for its nav) and reuses **Icon** for the
field's leading/caret glyphs. The Date Range Picker shares this same field + popover shell with the
Calendar in `mode="range"`.

## Accessibility

- The trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`.
- Dismisses on outside click / Escape (via each kit's overlay primitive).
- Desktop-first — no minimum target size. Keyboard grid navigation inside the Calendar is the same
  shared roving-focus TODO noted on the Calendar.

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract, one shared CSS layer | ✅ |
| Real date objects (not stringly-typed) | ✅ |
| Two-way binding per kit idiom (`@bind-Value` / `[(value)]`) | ✅ |
| Reuses Calendar + Icon (no bespoke month grid) | ✅ |
| Floats via each kit's native overlay primitive | ✅ |
