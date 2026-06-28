# `DfStatusTag` — `<df-status-tag>`

> A small semantic status label (success / neutral / warning / error). The colour carries the
> meaning.

**Tier:** Primitive
**Selector:** `df-status-tag`
**Source:** [`../../status-tag/status-tag.ts`](../../status-tag/status-tag.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `StatusTagVariant` | `'success'` | Drives the host class `df-status-tag--<variant>` |
| `label` | input | `string` | `''` | Rendered as text; **no projection fallback** |

**Content slots:** none — text comes from `label` only.
**Exported types:** `StatusTagVariant = 'success' \| 'neutral' \| 'warning' \| 'error'`

## Usage

```html
<df-status-tag variant="warning" label="Deprecated" />
<df-status-tag variant="error" label="Failed" />
```

## Composition

- Standalone primitive. Used in lists/tables/rows to flag state.

## States & accessibility

- The variant is **visual only** — colour is not announced. If the status must be conveyed to
  AT, ensure the surrounding text or an `aria-label` carries it (not currently built in).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ❌ | Renders `{{ label() }}` with **no `<ng-content>`** — can't project a highlight/link/icon (the §1 cap in [API-AUDIT](../API-AUDIT.md)) |
| §4 typed API | ✅ | Typed `variant` union |
| §7 a11y | ⚠️ | Colour-only meaning; no text alternative for the status |
| §8 tokens | ✅ | Variant colours from semantic tokens |

## Notes / TODO

- Convert to projection + `label` shorthand ([API-PROPOSAL §Rule 1](../API-PROPOSAL.md)).
- Consider a leading status dot/icon and a built-in accessible name for the variant.
