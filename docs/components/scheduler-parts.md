# Scheduler Parts

The four reusable atoms the **Month / Week / Agenda** scheduler views compose. All share one
category palette and one shared CSS layer (`styles/components/scheduler.css`).

- **Event Chip** — a compact event pill for month-view day cells.
- **Month Cell** — a tall day cell: date badge + stacked chips + `+N more` overflow.
- **Event Block** — a week time-grid block (positioned by its parent column).
- **Agenda Row** — a list row with a category bar.

## Where they're named

| Part | React | Angular / Web Components | Blazor |
|---|---|---|---|
| Event Chip | `<EventChip>` | `<lucent-event-chip>` | `<LucentEventChip>` |
| Month Cell | `<MonthCell>` | `<lucent-month-cell>` | `<LucentMonthCell>` |
| Event Block | `<EventBlock>` | `<lucent-event-block>` | `<LucentEventBlock>` |
| Agenda Row | `<AgendaRow>` | `<lucent-agenda-row>` | `<LucentAgendaRow>` |

Packages: `@design-foundry/lucent-react` · `@design-foundry/lucent-angular` (Angular) ·
`@design-foundry/lucent-wc` · `DesignFoundry.Lucent`.

## Category palette

Events are colored by **category**, backed by first-class semantic tokens
(`tokens/event-categories.css`) — the system previously had none, so the schedulers reached into
primitive ramps directly; these tokens fix that and are theme-aware (light / dark).

| Category | Ramp | Light surface / text | Meaning |
|---|---|---|---|
| `work` | pine (green) | `event-work-surface` / `-text` | Focused work |
| `meeting` | slate (blue) | `event-meeting-*` | Meetings / syncs |
| `personal` | warning (amber) | `event-personal-*` | Personal |
| `deadline` | error (red) | `event-deadline-*` | Deadlines |

Each part reads `--lucent-cat-surface` / `--lucent-cat-text` (set by the `--{category}` modifier),
with a `var()` fallback to `work` so an uncategorized part still renders.

## APIs

**Event Chip** — `category` (`work` default), `label`, `time?`.

**Month Cell** — `day`, `today?`, `outside?`, `events?` (`SchedulerEvent[]`), `maxVisible?` (`2`).
Renders the first `maxVisible` events as chips and collapses the rest into `+N more`. Today shows
an accent date badge over a subtle tint; outside-month cells are dimmed.

**Event Block** — `category`, `title`, `time?`. Fills its parent's height; the parent time-grid
column sets its `top`/`height` (via `style` in React/Blazor). A colored left bar marks the category.

**Agenda Row** — `category`, `time`, `title`, `subtitle?`. Fixed leading time column, a full-height
category bar, then the title/subtitle stack.

`SchedulerEvent` is `{ category, label, time? }` (a `record` in .NET). `EventCategory` is the union
`work | meeting | personal | deadline` (an `enum` in .NET; its lower-cased name is the CSS suffix).

## Composition

Month Cell reuses **Event Chip** internally (data-driven — pass `events`, not children — so the
Web Components light-DOM kit behaves like the others). The views draw the chrome (headers, weekday
row, hour gutter, gridlines) around these atoms.

## Conventions check

| Convention | Status |
|---|---|
| `lucent-` class contract, one shared CSS layer | ✅ |
| Category color via semantic tokens (not raw primitives) | ✅ new `event-*` tokens |
| Theme-aware (light / dark) | ✅ |
| Month Cell reuses Event Chip | ✅ |
| Data-driven cell events (uniform across kits) | ✅ |
