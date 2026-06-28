# `DfToast` — `<df-toast>`

> A single transient notification card (title + message + variant). Usually created via
> [`ToastService`](./toast-service.md) rather than placed by hand.

**Tier:** Overlay & feedback
**Selector:** `df-toast`
**Source:** [`../../toast/toast.ts`](../../toast/toast.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `title` | input | `string` | `''` | |
| `message` | input | `string` | `''` | |
| `variant` | input | `ToastVariant` | `'informative'` | |
| `closable` | input | `boolean` | `true` | Shows the close `df-icon-button` |
| `closed` | output | `void` | — | Emitted when dismissed |

**Content slots:** none — `title`/`message` only.
**Exported types:** `ToastVariant = 'informative' \| 'success' \| 'warning' \| 'error'`

## Usage

```html
<df-toast variant="success" title="Saved" message="Your changes are live." (closed)="dismiss()" />
```
Most code calls the service instead: `toast.success('Saved')`.

## Composition

- Rendered (stacked) by `ToastService` into a top-right CDK overlay; renders an internal
  `df-icon-button` for close.

## States & accessibility

- `role="status"`, `aria-live="polite"` — announced without stealing focus. Good for transient,
  non-critical messages. (Errors that demand attention may want `role="alert"`/`assertive`.)

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ⚠️ | `title`/`message` text-only — no projection for rich content |
| §4 output naming | ⚠️ | `closed` ok (past-tense); proposal standardizes overlays on `dismissed` |
| §7 a11y | ✅ | `status`/`polite` live region |
| §8 tokens | ✅ | |

## Notes / TODO

- Consider `role="alert"` for the `error` variant; optional projection for rich body.
