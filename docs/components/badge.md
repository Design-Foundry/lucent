# Badge — `<lucent-badge>`

> A small status indicator: an unread **count**, a short **label** ("AI", "NEW"), or a bare
> presence **dot**. Solid-filled on the accent/status axis. Reach for it to draw a glance to
> "there's something here" — not to describe a record's steady state (that's `status-tag`).

**Tier:** Primitive
**Targets:** `LucentBadge` (Angular · `lucent-badge`) · `Badge` (React) · `<lucent-badge>` (Web Components) · `LucentBadge` (Blazor)
**Source:** [`../../packages/angular/src/badge/badge.ts`](../../packages/angular/src/badge/badge.ts) · CSS [`../../styles/components/badge.css`](../../styles/components/badge.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `BadgeVariant` | `'neutral'` | Colour — host class `lucent-badge--<variant>` |
| `kind` | input | `BadgeKind` | `'label'` | Shape/content — host class `lucent-badge--<kind>` |
| `label` | input | `string` | `''` | Shorthand for the count/label text; projected content overrides it. Ignored for `dot` |

**Content slots:** default = count/label text (none for `dot`).
**Exported types:** `BadgeVariant = 'accent' | 'error' | 'success' | 'neutral'` · `BadgeKind = 'count' | 'label' | 'dot'`

## When to use

**Kind**
- **`count`** — a number that ticks (unread messages, notification count). Tabular figures keep
  the width from jittering; clamp large values yourself (`99+`).
- **`label`** — a 1–3 char classifier that rides alongside a name ("AI", "NEW", "BETA").
- **`dot`** — presence only, no number. Pair with an accessible name on the thing it marks.

**Variant**
- **`accent`** — the default "unread / needs attention" count (e.g. Chat Trigger, Conversation Row).
- **`error`** — a failure count or a blocking alert.
- **`success`** — a positive tally (rare; prefer `status-tag` for steady state).
- **`neutral`** — a de-emphasised count on a busy surface.

## Usage

```html
<!-- Web Components -->
<lucent-badge kind="count" variant="accent" label="3"></lucent-badge>
<lucent-badge kind="label" variant="neutral">AI</lucent-badge>
<lucent-badge kind="dot" variant="error"></lucent-badge>
```

```html
<!-- Angular -->
<lucent-badge kind="count" variant="accent" label="3" />
<lucent-badge kind="label">AI</lucent-badge>
```

```tsx
/* React */
<Badge kind="count" variant="accent" label="3" />
<Badge kind="label">AI</Badge>
<Badge kind="dot" variant="error" />
```

```razor
@* Blazor *@
<LucentBadge Kind="BadgeKind.Count" Variant="BadgeVariant.Accent" Label="3" />
<LucentBadge Kind="BadgeKind.Label">AI</LucentBadge>
<LucentBadge Kind="BadgeKind.Dot" Variant="BadgeVariant.Error" />
```

## Composition

- Composed **into** `chat-trigger` (unread FAB count) and `conversation-row` (unread pip);
  overlays an avatar or an icon-button as a positioned child at the usage site.
- Renders no sub-components — it is a leaf primitive.

## States & accessibility

- **Not interactive** — no role, focus, or keyboard. It annotates a nearby control.
- `kind="dot"` is decorative and carries `aria-hidden="true"`; the meaning must live on the
  labelled element (e.g. `aria-label="3 unread"` on the button it sits on).
- `count`/`label` render text, so the value is read; keep it terse.
- Colour is not the only signal — the surrounding label/context carries meaning, not the hue alone.

## Do / Don't

- **Do** clamp big counts (`99+`) and keep labels to a few characters.
- **Do** put the accessible name on the host control, not the dot.
- **Don't** use it for a record's steady status ("Active", "Archived") — that's `status-tag`.
- **Don't** encode meaning in colour alone.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-badge`, `--variant`) | ✅ | |
| §5 content model (projection + `label`) | ✅ | Projects, with `label` fallback |
| §6 state vocab | ✅ (n/a) | Non-interactive; no state axis |
| §7 a11y | ✅ | `dot` is `aria-hidden`; name lives on the host control |
| §8 tokens | ✅ | Semantic tokens only |

## Notes / TODO

- Overlay positioning (top-right of an avatar/button) is left to the usage site; a
  `badge-slot` wrapper could standardise it later.
