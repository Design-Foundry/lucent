# Spinner — `<lucent-spinner>`

> A rotating 270° ring for **indeterminate** waits — "something is happening, duration
> unknown". For a known-progress bar use `progress`; for content placeholders use `skeleton`.

**Tier:** Feedback
**Targets:** `LucentSpinner` (Angular · `lucent-spinner`) · `Spinner` (React) · `<lucent-spinner>` (Web Components) · `LucentSpinner` (Blazor)
**Source:** [`../../packages/angular/src/spinner/spinner.ts`](../../packages/angular/src/spinner/spinner.ts) · CSS [`../../styles/components/spinner.css`](../../styles/components/spinner.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `SpinnerSize` | `'md'` | `sm` 14 · `md` 16 · `lg` 24 |
| `label` | input | `string` | `'Loading'` | Accessible name (`aria-label`) |

**Exported types:** `SpinnerSize = 'sm' | 'md' | 'lg'`

## When to use

- **`sm`** — inline beside text, or inside dense controls.
- **`md`** — default; buttons/icon-buttons in their loading state.
- **`lg`** — a panel- or page-level "loading" placeholder.

Reach for a spinner only when you can't show *how much* is left. If you can, `progress` is
less anxious; if you're waiting on a list/card, `skeleton` preserves layout.

## Usage

```html
<lucent-spinner size="md"></lucent-spinner>              <!-- Web Components -->
```
```html
<lucent-spinner size="lg" label="Loading results" />    <!-- Angular -->
```
```tsx
<Spinner size="sm" />                                    {/* React */}
```
```razor
<LucentSpinner Size="SpinnerSize.Lg" Label="Loading results" />  @* Blazor *@
```

## Composition

- The same `.lucent-spinner` class is what `button`/`icon-button` emit for their loading
  state. **Bare** (no size modifier) the arc is `currentColor`, so it contrasts against a
  filled button automatically; the **sized** component form defaults to the accent colour.
- Renders no sub-components — the ring is pure CSS (a two-tone border + rotation).

## States & accessibility

- Carries `role="status"` and an `aria-label` (default "Loading"), so assistive tech
  announces the wait; the polite live region lets a later "done" replace it.
- Honours `prefers-reduced-motion` by slowing (not stopping — a stopped spinner reads as
  "hung"). Never remove the only indication that work is ongoing.

## Do / Don't

- **Do** give it a meaningful `label` when the wait isn't obvious from context.
- **Don't** use it for known progress (use `progress`) or to mask a slow list (use `skeleton`).
- **Don't** stack several spinners on one screen — one clear signal beats many.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-spinner`, `--size`) | ✅ | |
| §7 a11y (`role="status"`, reduced motion) | ✅ | |
| §8 tokens | ✅ | Semantic/primitive tokens only |
| §10 density | ✅ | `sm/md/lg` on the icon scale |

## Notes / TODO

- Closes the historical spinner gap (API-AUDIT §6): `.lucent-spinner` was referenced by
  `button`/`icon-button` but never defined, so their loading span rendered nothing. It now
  renders.
