# Progress — `<lucent-progress>`

> A linear progress bar. **Determinate** shows a known fraction (upload %, steps done);
> **indeterminate** shows a sliding sliver when the fraction is unknown but there's still a
> bar to show. If there's nothing to fill, use a `spinner`.

**Tier:** Feedback
**Targets:** `LucentProgress` (Angular · `lucent-progress`) · `Progress` (React) · `<lucent-progress>` (Web Components) · `LucentProgress` (Blazor)
**Source:** [`../../packages/angular/src/progress/progress.ts`](../../packages/angular/src/progress/progress.ts) · CSS [`../../styles/components/progress.css`](../../styles/components/progress.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input | `number` | `0` | Current value; ignored when `indeterminate` |
| `max` | input | `number` | `100` | Upper bound |
| `indeterminate` | input | `boolean` | `false` | Sliding sliver, unknown fraction |
| `label` | input | `string` | `''` | Accessible name (`aria-label`) |

Renders `.lucent-progress__bar` (the fill) inside the track host.

## When to use

- **Determinate** — you can compute a fraction: file upload, multi-step wizard, import job.
- **Indeterminate** — work is happening and you want a bar, but can't measure it yet (then
  switch to determinate once you can).
- Prefer a **`spinner`** for tiny inline waits or when a bar would be visual noise.

## Usage

```html
<lucent-progress value="64"></lucent-progress>                 <!-- 64% -->
<lucent-progress indeterminate label="Importing"></lucent-progress>
```
```tsx
<Progress value={64} max={100} />                              {/* React */}
<Progress indeterminate label="Importing" />
```
```razor
<LucentProgress Value="64" />                                  @* Blazor *@
<LucentProgress Indeterminate Label="Importing" />
```

## Composition

- Renders no sub-components — a track host with a single fill bar.
- Pair with a percentage label or step text beside it at the usage site.

## States & accessibility

- Host is `role="progressbar"`. Determinate exposes `aria-valuemin`/`aria-valuemax`/
  `aria-valuenow`; indeterminate omits `aria-valuenow` so AT announces "busy", not a number.
- Give it an `aria-label` (via `label`) when the surrounding text doesn't already name it.
- Honours `prefers-reduced-motion` — the indeterminate slide becomes a gentle opacity pulse.

## Do / Don't

- **Do** switch from indeterminate to determinate the moment you can measure progress.
- **Do** clamp `value` to `0…max` (the component does this defensively).
- **Don't** use indeterminate progress as decoration — it implies ongoing work.
- **Don't** hide the only cue on reduced-motion; the pulse keeps the signal.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-progress`, `__bar`, `--indeterminate`) | ✅ | |
| §7 a11y (`progressbar` + value attrs) | ✅ | |
| §8 tokens | ✅ | Track `border-default`, fill `accent-default` |

## Notes / TODO

- A `tone`/variant (success/error fill) and a buffered/segmented mode could follow if a
  usage site needs them.
