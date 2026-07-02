# Textarea — `<lucent-textarea>`

> A multi-line text field for free-form input (a message, a description, notes). The
> single-line sibling of `text-input` — same border-state contract and density scale, top-aligned
> with a resizable body.

**Tier:** Form input
**Targets:** `LucentTextarea` (Angular · `lucent-textarea`) · `Textarea` (React) · `<lucent-textarea>` (Web Components) · `LucentTextarea` (Blazor)
**Source:** [`../../packages/angular/src/textarea/textarea.ts`](../../packages/angular/src/textarea/textarea.ts) · CSS [`../../styles/components/textarea.css`](../../styles/components/textarea.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | model / input | `string` | `''` | Two-way (`[(ngModel)]`, `value`/`onChange`, `@bind`) |
| `size` | input | `ControlSize` | `'md'` | Density (`xs/sm/md/lg`) |
| `placeholder` | input | `string` | `''` | |
| `rows` | input | `number` | `3` | Initial visible rows; CSS also enforces a min-height |
| `readonly` | input | `boolean` | `false` | |
| `disabled` | input | `boolean` | `false` | |
| `label` / `hint` / `error` | slot (Angular) · input (React/WC/Blazor) | — | — | Label above; hint/error below (error wins + styles the border) |

**Content slots (Angular):** `[lucentLabel]` · `[lucentHint]` · `[lucentError]` (mirrors `text-input`).

## When to use

- **Free-form, multi-line** text: comments, descriptions, message bodies, notes.
- Use **`text-input`** for single-line values (name, email, search).
- The chat **`composer`** wraps a textarea with send/stop affordances — don't rebuild it here.

Match `size` to the surrounding form density; `rows` sets the starting height and the user can
drag to grow.

## Usage

```html
<!-- Angular -->
<lucent-textarea [(ngModel)]="notes" [rows]="4" placeholder="Add notes…">
  <span lucentLabel>Notes</span>
  <span lucentHint>Markdown supported</span>
</lucent-textarea>
```
```tsx
/* React */
<Textarea value={notes} onChange={setNotes} rows={4} label="Notes" hint="Markdown supported" />
```
```razor
@* Blazor *@
<LucentTextarea Label="Notes" Rows="4" Placeholder="Add notes…" name="notes" />
```

## Composition

- Renders no sub-components — a labelled wrapper around a native `<textarea>`.
- Shares the **border-state contract** with `text-input`: Default `border-subtle` → filled
  `border-default` → focus `border-strong` → error `error-subtle`. In the JS kits state is a
  wrapper modifier class; in Blazor `:focus-within` / `:has(textarea:not(:placeholder-shown))`
  make focus/filled work with no JS.

## States & accessibility

- Label is associated via `for`/`id`; hint/error are linked with `aria-describedby`, and the
  error state sets `aria-invalid`.
- `disabled`/`readonly` behave like `text-input`; Angular integrates with forms via CVA, Blazor
  posts natively.
- The textarea resizes vertically (`resize: vertical`) — never remove the resize affordance
  without providing autosize.

## Do / Don't

- **Do** pair it with a label and, where useful, a hint or character-count.
- **Do** pick `rows` close to the expected length so it doesn't start tiny.
- **Don't** use it for single-line input (use `text-input`).
- **Don't** reimplement the chat composer here — compose `composer` instead.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-textarea`, `__wrapper--*`) | ✅ | |
| §5 content model (label/hint/error) | ✅ | Slots (Angular) / props (others), mirrors `text-input` |
| §6 `disabled` / §9 forms (CVA) | ✅ | Mirrors `text-input`/`checkbox` |
| §7 a11y (`for`/`aria-describedby`/`aria-invalid`) | ✅ | |
| §8 tokens | ✅ | Same token set as `text-input` |
| §10 density | ✅ | `xs/sm/md/lg` |

## Notes / TODO

- Autosize (grow-with-content) could be added as an opt-in; today it's user-resizable + `rows`.
