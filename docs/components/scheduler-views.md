# Scheduler Views

Three full calendars that compose the [scheduler parts](./scheduler-parts.md): **Month**, **Week**,
and **Agenda**. Each is data-driven — you pass events; the view lays them out and draws the chrome
(toolbar, weekday row, hour gutter, gridlines).

## Where they're named

| View | React | Angular / Web Components | Blazor |
|---|---|---|---|
| Month | `<SchedulerMonth>` | `<lucent-scheduler-month>` | `<LucentSchedulerMonth>` |
| Week | `<SchedulerWeek>` | `<lucent-scheduler-week>` | `<LucentSchedulerWeek>` |
| Agenda | `<SchedulerAgenda>` | `<lucent-scheduler-agenda>` | `<LucentSchedulerAgenda>` |

Shared toolbar classes (`.lucent-scheduler__header` / `__title` / `__nav`) are reused by all three.

## Event data

- **`DatedEvent`** — `{ date, category, label, time? }`, used by Month & Agenda (bucketed by day).
- **`TimedEvent`** — `{ date, startHour, endHour, category, title }`, used by Week. `startHour` /
  `endHour` are **decimal hours** (`9.5` = 9:30). Both are `record`s in .NET.

## Month

Toolbar (`MMMM yyyy` title + prev/next) · weekday row · a 6×7 grid of [Month Cells](./scheduler-parts.md).
Events are bucketed by day; each cell shows up to `maxPerDay` (default `2`) chips then `+N more`.
Prev/next navigate the month.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `month` | `Date` | today | Displayed month; navigable. Two-way in Angular/Blazor. |
| `events` | `DatedEvent[]` | `[]` | Placed into their day cells. |
| `maxPerDay` | `number` | `2` | Chips per cell before overflow. |
| `monthchange` / `onMonthChange` / `MonthChanged` | event `Date` | — | On prev/next. |

## Week

Toolbar (week-range title + prev/next) · a sticky day-header row · an hour gutter and 7 day columns.
[Event Blocks](./scheduler-parts.md) are absolutely positioned by time: `top = (startHour − startHour0) × 44px`,
`height = duration × 44px`. Today's column is tinted and shows a red **now-line**.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `weekStart` | `Date` | current week | Any date within the week; snapped to Monday. Navigable. |
| `events` | `TimedEvent[]` | `[]` | Positioned within their day column. |
| `startHour` / `endHour` | `number` | `8` / `18` | Visible hour range. |
| `showNow` | `boolean` | `true` | Draw the now-line in today's column. |
| `weekchange` / `onWeekChange` / `WeekStartChanged` | event `Date` | — | On prev/next (new Monday). |

## Agenda

Toolbar (title) · events grouped by day, each group a day header (`Today` / `Weekday, Mon d`) plus
[Agenda Rows](./scheduler-parts.md). Renders an empty state when there are no events.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `events` | `DatedEvent[]` | `[]` | Grouped + sorted by day. |
| `title` | `string` | `Upcoming` | Toolbar title. |
| `emptyText` | `string` | `Nothing scheduled` | Empty-state message. |

## Composition

Month reuses **Month Cell** (→ **Event Chip**); Week reuses **Event Block**; Agenda reuses **Agenda
Row**. All reuse **Icon Button** for prev/next. Category color flows from the `event-*` semantic
tokens through the parts — the views add no new color.

## Accessibility

- Prev/next carry accessible names.
- Month grid math is Monday-first, matching the Calendar and Date pickers.
- Desktop-first; no drag-to-create/resize yet (the Piano Roll prototype covers that interaction
  pattern for a future pass).

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract, one shared CSS layer | ✅ |
| Data-driven, composes the parts (no re-implemented atoms) | ✅ |
| Shared toolbar across views | ✅ |
| Time math tokenized to a single hour-height | ✅ |
| en-US / invariant formatting across kits (incl. Blazor) | ✅ |
