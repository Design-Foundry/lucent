# `DfSnackbar` — `<df-snackbar>`

> A single bottom-center message with an optional icon and one action button. Usually created
> via [`SnackbarService`](./snackbar-service.md).

**Tier:** Overlay & feedback
**Selector:** `df-snackbar`
**Source:** [`../../snackbar/snackbar.ts`](../../snackbar/snackbar.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `message` | input | `string` | `''` | |
| `icon` | input | `string` | `'widgets'` | Leading icon (correct `icon` name) |
| `showIcon` | input | `boolean` | `true` | |
| `actionLabel` | input | `string` | `''` | Shows the action `df-button` when set |
| `action` | output | `void` | — | Emitted when the action is pressed |

**Content slots:** none — `message` only.
**Exported types:** none.

## Usage

```html
<df-snackbar message="Item archived" actionLabel="Undo" (action)="undo()" />
```
Usually: `snackbar.open({ message: 'Item archived', actionLabel: 'Undo', onAction: undo })`.

## Composition

- Rendered by `SnackbarService` (single, bottom-center, replace-on-open); renders an internal
  `df-icon` + `df-button`.

## States & accessibility

- **No live-region role** on the component itself (unlike `df-toast`'s `role="status"`), so
  screen readers may not announce it. The action is a real `df-button` (focusable).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 adornment shorthand | ✅ | `icon` |
| §4 output naming | ❌ | bare `action` → `actioned` ([API-AUDIT §5](../API-AUDIT.md)) |
| §5 content model | ⚠️ | `message` text-only |
| §7 a11y | ⚠️ | No live-region role |
| §8 tokens | ✅ | |

## Notes / TODO

- Add a live-region role; rename `action` → `actioned` ([API-PROPOSAL §Rule 5](../API-PROPOSAL.md)).
