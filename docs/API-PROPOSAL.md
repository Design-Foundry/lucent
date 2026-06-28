# Proposed API conventions (v1)

A concrete answer to "which API?" — the rules to lock before the first published tag. Each
section is a single rule, the reasoning, and before/after. The aim is that a consumer learns
**one** meta-rule and can predict every component.

---

## The meta-rule

> **Convenience input, projection override — with identical names across the whole kit.**
> Configuration is `input()`. Visible content projects via `<ng-content>`. Where a simple
> case is common, a component offers a shorthand `input()` that the matching projection slot
> *overrides* when present.

This isn't a new pattern — `df-tab` already does it for text
(`<ng-content>{{ label() }}</ng-content>`) and `df-modal` does it for the header. The proposal
is to make it **universal and named consistently**, instead of one-off per component. It
reconciles the two things that fight today: data-driven ergonomics (`[label]="x"` in an
`@for`) and rich expressiveness (project a link/badge/match-highlight).

Everything below is this rule applied.

---

## Rule 1 — Primary content

- **Projects** via the default `<ng-content>`.
- Optional shorthand: **`label` input**, rendered only as the projection's fallback.

```html
<!-- shorthand (terse, data-driven) -->
<df-chip [label]="tag.name" />
<!-- override (rich) -->
<df-chip><strong>{{ match }}</strong>{{ rest }}</df-chip>
```
```html
<!-- template inside every text-bearing component -->
<span class="…__label"><ng-content>{{ label() }}</ng-content></span>
```

Apply to: `chip`, `status-tag`, `list-item`, `menu-item`, `option`, `tab`, `checkbox`,
`toggle`. (`button`/`tag` already project; just add the `label` shorthand for parity.)

**Retire:** the pure-`{{ label() }}`-with-no-projection templates. They are the cap on
expressiveness.

---

## Rule 2 — Adornments (icons & extras)

One slot pair, **`dfLeading` / `dfTrailing`**, on every row/control. One shorthand, **`icon`**
(always that name — never `name`), equal to projecting `<df-icon dfLeading>`.

```html
<df-menu-item icon="delete" variant="danger" label="Delete" />     <!-- shorthand -->
<df-list-item>                                                       <!-- override -->
  <df-avatar dfLeading [name]="m.name" />
  {{ m.name }}
  <df-icon-button dfTrailing icon="more_vert" ariaLabel="Actions" />
</df-list-item>
```

- `df-nav-icon`'s `name` → rename to `icon` (with `name` kept as a deprecated alias for one
  minor).
- Form fields (`input`/`select`) keep `dfLabel`/`dfHint`/`dfError` (those are distinct *field
  regions*, not adornments) but adopt `dfLeading`/`dfTrailing` in place of `dfPrefix`/`dfSuffix`
  so the adornment vocabulary is the same kit-wide. (Alias the old names through one minor.)

---

## Rule 3 — Collections

**Projection of typed child components is the default.** An `options`-style array input is an
*optional convenience* that internally renders the same child component — and its item type
must be **as capable as** that child (never weaker, the current `SelectOption` bug).

This unblocks the concrete hole: `df-select` should accept projected `df-option`s.

```html
<!-- default: projection — gives you disabled, icons, custom content, groups for free -->
<df-select [(ngModel)]="role">
  <span dfLabel>Role</span>
  <df-option [value]="'admin'">Admin</df-option>
  <df-option [value]="'member'" disabled>Member (seats full)</df-option>
</df-select>

<!-- convenience: array, for trivial data-driven cases -->
<df-select [(ngModel)]="role" [options]="roles" />
```
```ts
// widened + generic; matches what df-option can actually render
interface SelectOption<T> {
  value: T;
  label?: string;          // optional — defaults to String(value)
  disabled?: boolean;
  icon?: string;
}
```

Same principle fixes `breadcrumbs`: keep `items` as the convenience, but render real
`<a>`/`routerLink` and allow projected items for the rich case (see Rule 6 a11y).

---

## Rule 4 — One row primitive  ✅ *reference landed*

> **Status:** `df-list-item` is implemented as the reference (content model, adornment slots,
> state vocab, interaction). `df-option` / `df-menu-item` not yet folded in. New slot markers
> `dfLeading` / `dfTrailing` / `dfSupporting` shipped in `slots/slots.ts`.


`df-list-item`, `df-option`, and `df-menu-item` are the same thing — an interactive row — with
divergent APIs. Unify them on one internal primitive (or one shared mixin) so they share
content model (Rules 1–2), state vocab (Rule 5), and a11y. Proposed `df-list-item` shape,
rich enough for the product:

```ts
@Component({ selector: 'df-list-item', /* role/keyboard when interactive */ })
export class DfListItem<T = unknown> {
  readonly value      = input<T>();
  readonly label      = input('');                                   // Rule 1 shorthand
  readonly icon       = input('');                                   // Rule 2 shorthand
  readonly selected   = input(false, { transform: booleanAttribute });  // Rule 5
  readonly disabled   = input(false, { transform: booleanAttribute });  // Rule 5
  readonly interactive = input(true, { transform: booleanAttribute }); // adds role + keyboard
  readonly activated  = output<T | undefined>();                     // Rule 5 naming
}
```
```html
<ng-content select="[dfLeading]">@if (icon()) { <df-icon [name]="icon()" /> }</ng-content>

<div class="df-list-item__content">
  <span class="df-list-item__primary"><ng-content>{{ label() }}</ng-content></span>
  <span class="df-list-item__supporting"><ng-content select="[dfSupporting]" /></span>
</div>

<ng-content select="[dfTrailing]" />
```

Gains over today: two-line rows (`dfSupporting`), real primary slot (link/badge/highlight),
semantic leading/trailing, a selection model (`selected` + typed `value`), and interaction
(`activated`, `role`, keyboard). `df-option`/`df-menu-item` become thin specializations
(option adds `aria-selected` listbox semantics; menu-item adds `variant`).

---

## Rule 5 — State & events

**Disabled:** every interactive component exposes a `disabled` **input** *and* honors forms
(`setDisabledState` sets the same signal). Fixes `<df-checkbox disabled>` doing nothing
outside a form.

**Selection vocabulary, fixed meanings kit-wide:**
- `selected` = *chosen* (maps to `aria-selected`). Use for tab, list-item, option, chip-active.
- `active` = *transient keyboard highlight only* (maps to `aria-activedescendant`). Options/menu.

(Today `df-list-item.active` and `df-tab.active` mean "chosen" — rename to `selected`.)

**Output naming, one rule:** past-tense verb for "it happened"; `model()` two-way for state;
`xChange` reserved for Angular's auto-emitted model change.

| Today | Proposed |
|---|---|
| `clicked` (button) | `clicked` ✓ (keep) |
| `optionSelect` (option) | `activated` |
| `tabClick` / `tabChange` | `activated` (tab) / two-way `[(value)]` on tab-list |
| `itemClick` (breadcrumbs) | `activated` |
| `selectionChange` (select) | value via CVA / `[(ngModel)]`; add `selectionChanged` only if a non-form event is needed |
| `closed` (toast/modal) | `dismissed` |
| `action` (snackbar) | `actioned` |
| `cleared`, `confirmed`, `cancelled` | keep (already past-tense) |

---

## Rule 6 — Generics, typing & a11y

- **Generic values:** `DfSelect<T>`, `SelectOption<T>`, `DfOption<T>`, `DfListItem<T>` — so a
  select's selection is typed instead of `unknown`. `df-tab` `value` can stay `string` or go
  generic.
- **`df-breadcrumbs`:** render `<nav aria-label="Breadcrumb"><ol><li><a>` with
  `aria-current="page"` on the last item; integrate `routerLink` via `path`.
- **`df-chip`:** split the conflated `type` into orthogonal axes — `variant`
  (`default`/`active`) + `removable` (boolean, enables the trailing remove + `removed` output)
  + leading icon via Rule 2. No more "remove only works when `type==='action'`."
- **`df-tooltip`:** migrate to `input()` (last component on legacy `@Input`).
- **Form-field wrapper (optional but recommended):** the `dfLabel`/`dfHint`/`dfError` trio is
  re-implemented in both `input` and `select`. Extract a `df-form-field` (or a shared host
  mixin) so future controls (textarea, radio-group, date) get it for free and it's defined
  once.

---

## What this costs / sequencing

Rules 1, 2, 5 (renames) are **breaking** — which is exactly why they belong *before* v1, not
after. Suggested order (also in [API-AUDIT.md](./API-AUDIT.md) §7):

1. **Rules 1–2** (content + adornment model) — refit every component. Biggest, most breaking.
2. **Rule 3 + Rule 6 generics** — `df-select` ↔ `df-option`, typed values.
3. **Rule 4** — the row primitive; fold in `option`/`menu-item`.
4. **Rule 5** — disabled, selection vocab, output renames.
5. **Rule 6 a11y/wrapper** — breadcrumbs, chip split, tooltip, form-field.

Recommended first concrete step: implement **Rule 4's `df-list-item`** as the reference —
it exercises Rules 1, 2, and 5 at once, and gives the rest of the kit a pattern to copy.
