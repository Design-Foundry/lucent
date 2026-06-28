# Conventions

The standing rulebook for the Design Foundry component kit. If you learn the rules here, you
can predict any component's API and build a new one that fits. This is the **target** state;
where the current code deviates, [API-AUDIT.md](./API-AUDIT.md) catalogues the gaps and
[API-PROPOSAL.md](./API-PROPOSAL.md) carries the rationale. When this file and a component
disagree, the component is the bug — not this file.

> The one meta-rule everything below serves:
> **Configuration is `input()`. Visible content projects via `<ng-content>`. Where a simple
> case is common, a `label`/`icon` shorthand `input()` is offered that the matching
> projection slot _overrides_ when present — with identical names across the whole kit.**

---

## 1. Files & folder structure

One component per folder, named in `kebab-case`, matching the selector minus the `df-` prefix:

```
button/
  button.ts          # @Component / @Directive
  button.html        # template — omit when the template is trivial (use inline `template:`)
  button.scss        # styles — always a separate file
```

- **Inline templates** are fine only for near-empty shells (`df-list` is `<ng-content />`,
  `df-card` projects a surface). Anything with logic or more than ~2 elements gets a `.html`.
- **Services** live with their feature: `dialog/dialog.service.ts`,
  `notifications/toast.service.ts`. **Marker directives** live in `slots/slots.ts`.
- Exported public types live **in the component file** (e.g. `export type ButtonVariant` in
  `button.ts`) and are re-exported from [`index.ts`](../index.ts).

## 2. Naming

| Thing | Rule | Example |
|---|---|---|
| Selector | `df-` + kebab | `df-list-item`, `[dfTooltip]` (directive) |
| Class | `Df` + PascalCase | `DfListItem`, `DfTooltip` |
| Files | kebab, match folder | `list-item.ts/.html/.scss` |
| CSS classes | BEM, `df-<block>__<element>--<modifier>` | `.df-list-item__primary`, `.df-tab--active` |
| Host state classes | `is-<state>` | `is-selected`, `is-disabled`, `is-interactive` |
| Exported types | `Pascal`, no `Df` for unions | `ButtonVariant`, `IconSize`, `SelectOption<T>` |

`index.ts` is the **only** public entrypoint. It is grouped by tier (Primitives →
Interactive → Navigation → Form inputs → Data display → Containers → Overlays → Services).
A component is not public until it is exported there.

## 3. Component definition

Every component uses the same skeleton:

```ts
@Component({
  selector: 'df-thing',
  standalone: true,                              // always (the kit has no NgModules)
  changeDetection: ChangeDetectionStrategy.OnPush, // always
  imports: [/* only what the template uses */],
  templateUrl: './thing.html',
  styleUrl: './thing.scss',
  host: { /* state classes, aria, listeners — see §6, §7 */ },
})
export class DfThing { /* signal APIs only */ }
```

- **Standalone + OnPush + zoneless-friendly.** No `NgModule`, no `Zone`-dependent timing.
- **Host bindings carry presentation/semantics** (state classes, `role`, `aria-*`, key
  listeners). Keep them in the `host` object, not sprinkled in the template.

## 4. API surface

- **Inputs are signal inputs:** `readonly foo = input(default)`. Never `@Input()`.
- **Booleans use the attribute transform** so `<df-x disabled>` works:
  `readonly disabled = input(false, { transform: booleanAttribute })`.
- **Two-way state uses `model()`** (e.g. `df-tab.active`, `df-tab.scale`), exposed as
  `[(x)]`.
- **Values are generic**, not `unknown`: `DfListItem<T>`, `SelectOption<T>`. The identity a
  component emits should be typed by the consumer.
- **Outputs are `output<T>()`** and named **past-tense for "it happened"**:
  `activated`, `dismissed`, `cleared`, `removed`, `clicked`. Reserve `xChange` for Angular's
  auto-emitted `model()` change only. (See [audit §5](./API-AUDIT.md) for the names still
  being migrated.)
- **Interactive controls take a `size`** of the shared `ControlSize` scale (default `'md'`).
  This is non-negotiable for a dense tool UI — see §10 and
  [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

## 5. Content & composition

These are the rules that make the kit predictable. All four are the meta-rule applied.

- **Primary content projects** via the default `<ng-content>`; `label` is an optional
  shorthand rendered as the projection's fallback:
  ```html
  <span class="df-x__label"><ng-content>{{ label() }}</ng-content></span>
  ```
- **Adornments** use one slot pair kit-wide — **`dfLeading` / `dfTrailing`** — plus an
  `icon` shorthand (always that name, never `name`) equal to projecting `<df-icon dfLeading>`.
  A projected `dfLeading` overrides the `icon` shorthand.
- **Secondary text** uses **`dfSupporting`** (second line).
- **Collections** default to **projection of typed child components** (`<df-tab>` into
  `df-tab-list`, `<df-option>` into `df-select`). An `items`/`options` array input is an
  _optional_ convenience whose item type must be **as capable as** the child it renders.
- **Marker directives** (`dfLabel`/`dfHint`/`dfError`) are reserved for **distinct regions of
  a composite control** (form fields), not for primary content.

Detect projected slots with content queries, mirroring `df-input`:
```ts
protected readonly leadingRef = contentChild(DfLeading);   // gate the icon fallback / wrappers
```

`df-list-item` is the **reference implementation** of §4–§7 — copy its shape.

## 6. State vocabulary (fixed meanings)

| Term | Meaning | Maps to |
|---|---|---|
| `selected` | **chosen** (the current tab/row/option) | `aria-selected` (on listbox/tab specializations) |
| `active` | **transient keyboard highlight only** | `aria-activedescendant` |
| `disabled` | non-interactive | `aria-disabled` + skipped handlers |
| `interactive` | row is activatable (adds `role`/keyboard) | — |

- **Every interactive component exposes a `disabled` _input_ AND honors forms** — a form
  control's `setDisabledState` must set the same signal a standalone `[disabled]` would.
- Don't reuse `active` to mean "chosen" (the historical `df-list-item`/`df-tab` mistake).

**Two colour axes — keep them separate.** "Red" does two unrelated jobs; don't merge them:

| Axis | Type / values | Means | Use on |
|---|---|---|---|
| **`tone`** (action intent) | `Tone = 'default' \| 'danger'` | *this action is destructive* | button, icon-button, menu-item, list-item, option |
| **status** (severity) | `info \| success \| warning \| error` | *this thing failed / its state* | field `dfError`, status-tag, toast, snackbar, banner |

- One word kit-wide for intent: **`danger`** (not `destructive` — that's a deprecated alias).
  Keep **`error`** for the status axis.
- Both render with the `--color--semantic--error*` family but are **different props on
  different roles** — don't fold `danger` into a visual `variant` (it's orthogonal: a ghost
  button can still be `tone="danger"`), and don't reuse a status `error` enum for an action.
- `danger` **intensifies on hover** (you're about to do the dangerous thing).
- `df-list-item` is the reference (`tone` input + `is-danger`); copy its pattern.

## 7. Accessibility

- Interactive hosts get a `role`, a `tabindex`, and keyboard activation (Enter/Space →
  the same path as click; `preventDefault` on Space to avoid scroll).
- Focus is shown with `:focus-visible` using `--color--semantic--border-focus`, never removed.
- Icons are decorative by default (`aria-hidden`); set `ariaLabel` only when the icon carries
  meaning on its own (see `df-icon`).
- Semantic selection ARIA (`aria-selected`) belongs to listbox/tab specializations; a generic
  row renders selection visually and leaves `aria-current` to the usage site.

## 8. Styling & tokens

- **Only semantic tokens** in component SCSS — `var(--color--semantic--…)`,
  `var(--dimension--primitive--spacing-…)`, `var(--radius-…)`, `var(--typography--…)`. No raw
  hex, px, or font names. This is what makes theming and rebranding free (see [README](./README.md)).
- **Token layers** (defined in `_*.scss`, order matters): `tokens` → `semantic-colors` →
  `surfaces` → `borders` → `shadows` → `typography` → `controls` → `themes` (dark last).
- **UI text uses the `label-*` roles** (`label-lg/md/sm`, tight line-height, weight 500) or the
  `--control-*` text tokens — **not** `body`/`caption` (those are reading text, with loose
  line-heights). Single-line control text uses `--control-line`. See
  [FOUNDATIONS-TYPOGRAPHY.md](./FOUNDATIONS-TYPOGRAPHY.md). Never hardcode `px` font sizes.
- **Hover/selected pattern** (from `df-option`, the working reference):
  ```scss
  &:hover  { background: var(--color--semantic--surface-base); }
  &.is-selected { background: oklch(from var(--color--semantic--surface-base) calc(l - 0.04) c h); }
  ```
  > ⚠️ Do **not** use `--color--semantic--surface-subtle` — it is **undefined** (see
  > [audit §5](./API-AUDIT.md)); `df-menu-item` and old `df-list-item` had dead hovers from it.
- Theming is pure CSS via `data-theme` on `<html>` and `prefers-color-scheme`. Components
  reference semantic tokens only, so re-theming is automatic — no provider/service.

## 9. Forms (ControlValueAccessor)

Form controls (`df-input`, `df-inline-input`, `df-checkbox`, `df-toggle`, `df-select`)
implement `ControlValueAccessor` so they drop into `[(ngModel)]` and `formControlName`:

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DfThing), multi: true }]
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
  host class `df-<comp>--{{size}}`.
- Consume the **`--control-*` tokens** (`height`/`text`/`icon`/`radius`/`pad-x`/`gap`) from
  [`_controls.scss`](../_controls.scss) — never hardcode control heights. The house pattern is
  local `--_h/--_text/--_radius/--_gap/--_px` vars set per size class (copy `button.scss`).
- The alignment contract is **height + text + icon + radius + gap**. Inline padding is a field
  baseline; buttons deliberately exceed it (they own their `--_px`).
- New controls **must** support `size`. Full spec + rationale in
  [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

> Several older controls (`icon-button` `sm/md/lg`, `toggle` `sm/md`, `tab` `xs…lg`, `avatar`,
> `icon` `xs…xl`) predate this scale and don't yet use `ControlSize` — see the roadmap.

---

See [BUILDING-A-COMPONENT.md](./BUILDING-A-COMPONENT.md) for the step-by-step runbook,
[FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md) for the density spec, and
[components/](./components/) for the per-component reference.
