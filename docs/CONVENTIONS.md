# Conventions

The standing rulebook for the Lucent component kits. If you learn the rules here, you
can predict any component's API and build a new one that fits. This is the **target** state.
When this file and a component disagree, the component is the bug — not this file.

> The one meta-rule everything below serves:
> **Configuration is `input()`. Visible content projects via `<ng-content>`. Where a simple
> case is common, a `label`/`icon` shorthand `input()` is offered that the matching
> projection slot _overrides_ when present — with identical names across the whole kit.**

---

## 1. Files & folder structure

One component per folder, named in `kebab-case`, matching the selector minus the `lucent-` prefix:

```
button/
  button.ts          # @Component / @Directive
  button.html        # template — omit when the template is trivial (use inline `template:`)
```

**No style file.** A component's appearance lives once in `styles/components/button.css`
and is shared by every kit. A kit that ships its own CSS has broken the contract.

- **Inline templates** are fine only for near-empty shells (`lucent-list` is `<ng-content />`,
  `lucent-card` projects a surface). Anything with logic or more than ~2 elements gets a `.html`.
- **Services** live with their feature: `dialog/dialog.service.ts`,
  `notifications/toast.service.ts`. **Marker directives** live in `slots/slots.ts`.
- Exported public types live **in the component file** (e.g. `export type ButtonVariant` in
  `button.ts`) and are re-exported from `index.ts`.

## 2. Naming

| Thing | Rule | Example |
|---|---|---|
| Selector | `lucent-` + kebab | `lucent-list-item`, `[lucentTooltip]` (directive) |
| Class | `Lucent` + PascalCase | `LucentListItem`, `LucentTooltip` |
| Files | kebab, match folder | `list-item.ts/.html` |
| CSS classes | BEM, `lucent-<block>__<element>--<modifier>` | `.lucent-list-item__primary`, `.lucent-tab--active` |
| Host state classes | `is-<state>` | `is-selected`, `is-disabled`, `is-interactive` |
| Exported types | `Pascal`, no `Lucent` for unions | `ButtonVariant`, `IconSize`, `SelectOption<T>` |

`index.ts` is the **only** public entrypoint. It is grouped by tier (Primitives →
Interactive → Navigation → Form inputs → Data display → Containers → Overlays → Services).
A component is not public until it is exported there.

## 3. Component definition

Every component uses the same skeleton:

```ts
@Component({
  selector: 'lucent-thing',
  standalone: true,                              // always (the kit has no NgModules)
  changeDetection: ChangeDetectionStrategy.OnPush, // always
  imports: [/* only what the template uses */],
  templateUrl: './thing.html',        // no styleUrl — appearance lives in styles/components/
  host: { /* state classes, aria, listeners — see §6, §7 */ },
})
export class LucentThing { /* signal APIs only */ }
```

- **Standalone + OnPush + zoneless-friendly.** No `NgModule`, no `Zone`-dependent timing.
- **Host bindings carry presentation/semantics** (state classes, `role`, `aria-*`, key
  listeners). Keep them in the `host` object, not sprinkled in the template.

## 4. API surface

- **Inputs are signal inputs:** `readonly foo = input(default)`. Never `@Input()`.
- **Booleans use the attribute transform** so `<lucent-x disabled>` works:
  `readonly disabled = input(false, { transform: booleanAttribute })`.
- **Two-way state uses `model()`** (e.g. `lucent-tab.active`, `lucent-tab.scale`), exposed as
  `[(x)]`.
- **Values are generic**, not `unknown`: `LucentListItem<T>`, `SelectOption<T>`. The identity a
  component emits should be typed by the consumer.
- **Outputs are `output<T>()`** and named **past-tense for "it happened"**:
  `activated`, `dismissed`, `cleared`, `removed`, `clicked`. Reserve `xChange` for Angular's
  auto-emitted `model()` change only.
- **Interactive controls take a `size`** of the shared `ControlSize` scale (default `'md'`).
  This is non-negotiable for a dense tool UI — see §10 and
  [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

## 5. Content & composition

These are the rules that make the kit predictable. All four are the meta-rule applied.

- **Primary content projects** via the default `<ng-content>`; `label` is an optional
  shorthand rendered as the projection's fallback:
  ```html
  <span class="lucent-x__label"><ng-content>{{ label() }}</ng-content></span>
  ```
- **Adornments** use one slot pair kit-wide — **`lucentLeading` / `lucentTrailing`** — plus an
  `icon` shorthand (always that name, never `name`) equal to projecting `<lucent-icon lucentLeading>`.
  A projected `lucentLeading` overrides the `icon` shorthand.
- **Secondary text** uses **`lucentSupporting`** (second line).
- **Collections** default to **projection of typed child components** (`<lucent-tab>` into
  `lucent-tab-list`, `<lucent-option>` into `lucent-select`). An `items`/`options` array input is an
  _optional_ convenience whose item type must be **as capable as** the child it renders.
- **Marker directives** (`lucentLabel`/`lucentHint`/`lucentError`) are reserved for **distinct regions of
  a composite control** (form fields), not for primary content.

Detect projected slots with content queries, mirroring `lucent-text-input`:
```ts
protected readonly leadingRef = contentChild(LucentLeading);   // gate the icon fallback / wrappers
```

`lucent-list-item` is the **reference implementation** of §4–§7 — copy its shape.

## 6. State vocabulary (fixed meanings)

| Term | Meaning | Maps to |
|---|---|---|
| `selected` | **chosen** (the current tab/row/option) | `aria-selected` (on listbox/tab specializations) |
| `active` | **transient keyboard highlight only** | `aria-activedescendant` |
| `disabled` | non-interactive | `aria-disabled` + skipped handlers |
| `interactive` | row is activatable (adds `role`/keyboard) | — |

- **Every interactive component exposes a `disabled` _input_ AND honors forms** — a form
  control's `setDisabledState` must set the same signal a standalone `[disabled]` would.
- Don't reuse `active` to mean "chosen" (the historical `lucent-list-item`/`lucent-tab` mistake).

**Two colour axes — keep them separate.** "Red" does two unrelated jobs; don't merge them:

| Axis | Type / values | Means | Use on |
|---|---|---|---|
| **`tone`** (action intent) | `Tone = 'default' \| 'danger'` | *this action is destructive* | button, icon-button, menu-item, list-item, option |
| **status** (severity) | `info \| success \| warning \| error` | *this thing failed / its state* | field `lucentError`, status-tag, toast, snackbar, banner |

- One word kit-wide for intent: **`danger`** (not `destructive` — that's a deprecated alias).
  Keep **`error`** for the status axis.
- Both render with the `--color--semantic--error*` family but are **different props on
  different roles** — don't fold `danger` into a visual `variant` (it's orthogonal: a ghost
  button can still be `tone="danger"`), and don't reuse a status `error` enum for an action.
- `danger` **intensifies on hover** (you're about to do the dangerous thing).
- `lucent-list-item` is the reference (`tone` input + `is-danger`); copy its pattern.

## 7. Accessibility

- Interactive hosts get a `role`, a `tabindex`, and keyboard activation (Enter/Space →
  the same path as click; `preventDefault` on Space to avoid scroll).
- Focus is shown with `:focus-visible` using `--color--semantic--border-focus`, never removed.
- Icons are decorative by default (`aria-hidden`); set `ariaLabel` only when the icon carries
  meaning on its own (see `lucent-icon`).
- Semantic selection ARIA (`aria-selected`) belongs to listbox/tab specializations; a generic
  row renders selection visually and leaves `aria-current` to the usage site.

## 8. Styling & tokens

- **Only semantic tokens** in component CSS — `var(--color--semantic--…)`,
  `var(--dimension--primitive--spacing-…)`, `var(--radius-…)`, `var(--typography--…)`. No raw
  hex, px, or font names. This is what makes theming and rebranding free.
- **Token layers** (in `styles/tokens/`, order matters): `primitives` → `semantic-colors` →
  `surfaces` → `borders` → `shadows` → `typography` → `controls` → `layers` → `themes`
  (dark last).
- **UI text uses the `label-*` roles** (`label-lg/md/sm`, tight line-height, weight 500) or the
  `--control-*` text tokens — **not** `body`/`caption` (those are reading text, with loose
  line-heights). Single-line control text uses `--control-line`. See
  [FOUNDATIONS-TYPOGRAPHY.md](./FOUNDATIONS-TYPOGRAPHY.md). Never hardcode `px` font sizes.
- **Hover/selected pattern** (from `lucent-option`, the working reference):
  ```css
  &:hover  { background: var(--color--semantic--surface-base); }
  &.is-selected { background: oklch(from var(--color--semantic--surface-base) calc(l - 0.04) c h); }
  ```
  > ⚠️ Do **not** use `--color--semantic--surface-subtle` — it is **undefined**, and
  > referencing it is how menu and list items ended up with dead hover states.
- Theming is pure CSS via `data-theme` on `<html>` and `prefers-color-scheme`. Components
  reference semantic tokens only, so re-theming is automatic — no provider/service.

## 9. Forms (ControlValueAccessor)

Form controls (`lucent-text-input`, `lucent-inline-input`, `lucent-checkbox`, `lucent-toggle`, `lucent-select`)
implement `ControlValueAccessor` so they drop into `[(ngModel)]` and `formControlName`:

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LucentThing), multi: true }]
// writeValue / registerOnChange / registerOnTouched / setDisabledState
```

`setDisabledState` must set the **same** disabled signal the standalone `[disabled]` input
uses (§6), so behaviour is identical in and out of a form.

## 10. Density & sizing

Our domain is dense and control-heavy (think Figma, not a marketing dashboard). A single
fixed control height makes the UI tall and impossible to pair side-by-side. So **every
interactive control takes a `size`** of one shared scale, and the scale binds a *set* of
tokens (not just height) so controls at the same size line up:

| `size` | height | use |
|---|---|---|
| `xs` | 24px | toolbars, property rows (ultra-dense) |
| `sm` | 28px | dense panels / inspectors |
| `md` | 32px | **default** — matches the kit's historical height |
| `lg` | 40px | forms, primary CTAs, touch |

Rules:
- The shared type is **`ControlSize`** (`'xs' \| 'sm' \| 'md' \| 'lg'`), exported from the kit
  root. Every interactive control declares `readonly size = input<ControlSize>('md')` and a
  host class `lucent-<comp>--{{size}}`.
- Consume the **`--control-*` tokens** (`height`/`text`/`icon`/`radius`/`pad-x`/`gap`) from
  [`controls.css`](../styles/tokens/controls.css) — never hardcode control heights. The house pattern is
  local `--_h/--_text/--_radius/--_gap/--_px` vars set per size class (copy `styles/components/button.css`).
- The alignment contract is **height + text + icon + radius + gap**. Inline padding is a field
  baseline; buttons deliberately exceed it (they own their `--_px`).
- New controls **must** support `size`. Full spec + rationale in
  [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

---

See [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md) for the density spec and
[FOUNDATIONS-TYPOGRAPHY.md](./FOUNDATIONS-TYPOGRAPHY.md) for the type scale.
