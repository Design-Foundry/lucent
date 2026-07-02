# Inline notice — `<lucent-inline-notice>`

> An in-flow banner carrying a status message tied to a **region** — a validation summary above
> a form section, a note in a chat stream, a heads-up on a panel. Unlike a `toast`/`snackbar`
> (transient, floating, global), it stays put next to what it's about.

**Tier:** Feedback
**Targets:** `LucentInlineNotice` (Angular · `lucent-inline-notice`) · `InlineNotice` (React) · `<lucent-inline-notice>` (Web Components) · `LucentInlineNotice` (Blazor)
**Source:** [`../../packages/angular/src/inline-notice/inline-notice.ts`](../../packages/angular/src/inline-notice/inline-notice.ts) · CSS [`../../styles/components/inline-notice.css`](../../styles/components/inline-notice.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `InlineNoticeVariant` | `'info'` | Severity — host class + tint + default glyph |
| `title` / `heading` | input | `string` | `''` | Optional bold title line (`heading` in WC) |
| `icon` | input | `string` | (per variant) | Override the default glyph |
| `dismissible` | input | `boolean` | `false` | Shows a dismiss button |
| `dismissed` / `onDismiss` | output | — | — | Fired when dismissed (`dismiss` event in WC) |

**Content:** the message projects as children.
**Exported types:** `InlineNoticeVariant = 'info' | 'success' | 'warning' | 'error'`

## When to use

- **A message bound to a place** — a form-section error summary, an in-stream retry notice, a
  panel caveat. It should scroll with its context.
- Use **`toast`/`snackbar`** for transient, global confirmations; **`status-tag`** for a
  record's steady state; **`modal`** for a blocking decision.
- Match `variant` to meaning: `info` (neutral heads-up), `success` (done), `warning` (caution),
  `error` (failure / needs action).

## Usage

```html
<!-- Angular -->
<lucent-inline-notice variant="error" title="Upload failed" dismissible (dismissed)="retry()">
  The file exceeds 10 MB. <a href="#">Try a smaller file.</a>
</lucent-inline-notice>
```
```tsx
/* React */
<InlineNotice variant="success" title="Saved">Your changes are live.</InlineNotice>
```
```html
<!-- Web Components -->
<lucent-inline-notice variant="warning" heading="Heads up">Draft not yet published.</lucent-inline-notice>
```
```razor
@* Blazor *@
<LucentInlineNotice Variant="InlineNoticeVariant.Error" Title="Upload failed" Dismissible Dismissed="Retry">
  The file exceeds 10&nbsp;MB.
</LucentInlineNotice>
```

## Composition

- Renders a leading `icon` (per-variant default, overridable) and, when `dismissible`, a ghost
  `icon-button`. The message body holds rich content — including `reference-tag`s in a chat stream.
- Distinct from `toast`/`snackbar` (those float and time out); this one is part of the layout.

## States & accessibility

- `role="alert"` for `error`/`warning` (assertive), `role="status"` for `info`/`success`
  (polite), so screen readers announce appropriately.
- Colour is backed by an icon and text — never severity by hue alone.
- Dismiss is a real button with an accessible label ("Dismiss").

## Do / Don't

- **Do** keep the message short and, for errors, say what to do next.
- **Do** place it next to what it concerns (above the form section, in the stream).
- **Don't** use it for transient global confirmations (use `toast`).
- **Don't** stack many notices — consolidate or summarise.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-inline-notice`, `--variant`, `__*`) | ✅ | |
| §5 content model (projected message) | ✅ | Children in every kit |
| §6 status axis (info/success/warning/error) | ✅ | Status severity, not action `tone` |
| §7 a11y (`alert`/`status`, icon + text) | ✅ | |
| §8 tokens | ✅ | Soft tint via `color-mix` over `surface-default` |

## Notes / TODO

- An optional trailing action slot (e.g. a "Retry" text button) could be added; today compose
  it inside the message.
