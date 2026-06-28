# API consistency & completeness audit

The earlier review covered packaging and the *documented* surface. This one is harsher: it
looks at whether the public API is **coherent** — whether a consumer can learn one rule and
apply it everywhere — and where components are too thin to do real work. For a kit meant to
be distributed and learned by people who didn't write it, consistency *is* the product.

Verdict: the implementations are clean, but the **API has no shared content model**. Nearly
every component answers "how do I put text / an icon / a list of things into you?" a
different way. That, plus a few under-built components (`df-list-item` above all), is what's
"really missing."

---

## 1. There are four unreconciled answers to "what is the text of a thing"

Evidence (from the templates):

| Pattern | Components | Shape |
|---|---|---|
| **Projection** | `df-button`, `df-tag` | `<ng-content />` |
| **`label` input** | `df-list-item`, `df-menu-item`, `df-option`, `df-chip`, `df-status-tag`, `df-checkbox`, `df-toggle` | `label = input('')` → `{{ label() }}` |
| **Hybrid** | `df-tab` | `<ng-content>{{ label() }}</ng-content>` (projection with input fallback) |
| **Marker-slot** | `df-input`, `df-select` | `<ng-content select="[dfLabel]">` (a *field* label — different concept, same word) |

The cost: there is **no rule** a consumer can infer. Is `df-chip` `label="Draft"` or
`<df-chip>Draft</df-chip>`? It's the input — but `df-button` is the opposite, and `df-tab`
accepts both. Every component must be memorized individually. And the input form caps
expressiveness: because `df-list-item`/`df-option`/`df-chip` take a **string**, you cannot
put a `<strong>`-highlighted search match, an inline link, a badge, or an inline-edit field
into them — things a DesignOps UI needs constantly.

**Recommendation — pick one rule and apply it everywhere:**
- **Content (the visible text/children) projects** via `<ng-content>`. Always.
- **Configuration (variant, size, state, identity) is `input()`.** Always.
- A convenience `label` input is fine *only* as a shorthand that the projection overrides
  (the `df-tab` hybrid) — but then every text-bearing component should follow that exact
  pattern, not just `df-tab`.
- Reserve marker directives (`dfLabel`/`dfHint`/`dfError`) for **secondary** regions of a
  composite control (form fields), not for primary content.

---

## 2. There are three unreconciled answers to "how do I add an icon"

| Pattern | Components | Note |
|---|---|---|
| **`icon` string input** | `df-menu-item`, `df-tab`, `df-icon-button` | renders an internal `<df-icon>` |
| **`name` string input** | `df-nav-icon` | same idea, **different input name** |
| **`dfPrefix`/`dfSuffix` projection** | `df-button`, `df-list-item`, `df-input` | project your own `<df-icon>` |
| **Impossible / hardcoded** | `df-option` (none), `df-chip` (`type`-driven hash/close) | no consumer control |

So the answer to "add a leading icon" is `icon="x"` on a tab, `name="x"` on a nav-icon,
`<df-icon dfPrefix>` on a button, and *not possible* on an option. Same three problems as §1:
no rule, inconsistent naming (`icon` vs `name`), and capability holes.

**Recommendation:** standardize on **leading/trailing projection slots** (`dfPrefix`/`dfSuffix`,
or rename to `dfLeading`/`dfTrailing`) for adornments across all row/control components, and
keep a single `icon` *convenience* input with a consistent name where a bare icon is the
common case. Not both spellings.

---

## 3. There are two unreconciled answers to "how do I express a collection" — and they collide

| Pattern | Components |
|---|---|
| **Array input, rendered internally** | `df-select` (`options: SelectOption[]`), `df-breadcrumbs` (`items: BreadcrumbItem[]`) |
| **Projected child components** | `df-tab-list` (`<df-tab>`), `df-list` (`<df-list-item>`), `df-menu` (`<df-menu-item>`) |

The collision is concrete and bad:

> **`df-option` is a public, exported, documented component that cannot be used with
> `df-select`.** Select only accepts the `options` array and renders the options itself
> (`select.html` lines 48–57). You cannot project `<df-option>` into a select, supply an
> option template, group options, or render custom option content.

Worse, the array type is **strictly weaker than the component it drives**:

```ts
interface SelectOption { label: string; value: unknown; }   // what df-select accepts
// df-option actually supports: label, value, selected, active, disabled
```

So **you can't make a disabled option in a `df-select`** even though `df-option` implements
`disabled`. The data model throws away capability the rendering component already has. No
per-option icon, no description/secondary line, no option groups, no multi-select, no
type-ahead, and `value` is `unknown` (see §6).

**Recommendation:** pick the projection model for `df-select` (accept projected `df-option`s,
which unlocks disabled/icon/custom content/groups for free and makes `df-option` actually
useful), **or** — if the array API is kept for ergonomics — widen `SelectOption` to
`{ label; value; disabled?; icon?; description?; group? }` and make it generic. The current
middle state (a public `df-option` that nothing composes with) is the worst of both.

---

## 4. `df-list-item` is far too thin for the product (the named gap)

Current entire API: `label` (input string), `active`, `disabled`, and generic
`dfPrefix`/`dfSuffix` slots. Template is literally `prefix | {{label}} | suffix`.

A DesignOps app's lists (components, versions, members, assets, audit rows…) need rich rows.
What's missing:

- **Secondary / supporting text** — no two-line (title + subtitle) row. Very common.
- **A real primary-content slot** — `label` is a rigid string, so no highlighted match, link,
  badge, status-tag, or inline-edit in the primary region.
- **Semantic leading / trailing regions** — only generic prefix/suffix exist; no dedicated
  leading (avatar/icon/checkbox) vs trailing (meta text / actions / chevron) with the right
  layout + a11y. "Trailing actions" (a menu/button cluster) is a staple and is awkward today.
- **A selection model** — has `active` but not `selected` + `value`; a selectable list (single
  or multi) isn't expressible. (Note `df-option` has `selected`+`value`, `df-list-item` has
  `active` — divergent vocab for the same idea, see §5.)
- **Interaction & a11y** — no activate/`click` output, no `role`, no `href`/`routerLink`, no
  keyboard handling. A `df-list` of items isn't keyboard-navigable the way `df-tab-list` is.

A richer shape, consistent with the §1/§2 rules:

```html
<df-list-item [value]="m.id" [selected]="…" [disabled]="…" (activated)="open(m)">
  <df-avatar dfLeading [name]="m.name" />
  Primary text (projected — can hold a link, match highlight, badge…)
  <span dfSupporting>Secondary line</span>
  <span dfTrailing>{{ m.role }}</span>
  <df-icon-button dfTrailing icon="more_vert" … />
</df-list-item>
```

This also resolves an overlap: **`df-list-item`, `df-option`, and `df-menu-item` are three
near-identical "interactive row" components** with diverging APIs (`label` input vs
projection; `active` vs `selected`; icon input vs none vs slot) and none composable. They
should share one row primitive (or at least one content + state convention).

---

## 5. Cross-cutting inconsistencies

**Latent bug — dead `surface-subtle` token.** `df-list-item` (original) and `df-menu-item` both
set `background: var(--color--semantic--surface-subtle)` on `:hover`, but that token is **not
defined** anywhere in the token layer (`_surfaces.scss` defines `surface-base`/`-default`/
`-raised`/`-overlay` only). The hover silently does nothing. `df-option` uses the working
pattern instead: hover → `surface-base`, selected → `oklch(from … calc(l - 0.04) c h)`. The
refit `df-list-item` now follows the `df-option` pattern; **`df-menu-item` still has the dead
hover** and should be fixed when it's folded into the row primitive (Rule 4).

**Disabled isn't uniform.** `df-button`/`df-icon-button`/`df-tab`/`df-menu-item`/`df-option`/
`df-list-item` expose a `disabled` **input**; the form controls (`df-checkbox`/`df-toggle`/
`df-input`/`df-select`) only get disabled via forms (`setDisabledState`) — there is **no
standalone `[disabled]` input**, so `<df-checkbox disabled>` outside a form does nothing.
Pick one: every interactive component takes `[disabled]` *and* honors forms.

**Output names follow no convention.** Five styles in one kit:
`clicked` / `closed` / `cleared` / `confirmed` / `cancelled` (past tense) · `optionSelect`
(noun-verb) · `tabClick` / `itemClick` (noun-Click) · `tabChange` / `selectionChange`
(noun-Change) · `action` (bare noun). Settle one rule, e.g. **past-tense for "it happened"**
(`closed`, `cleared`, `activated`) and **`xChange` only for value/two-way** — and apply it.

**Selection vocabulary diverges.** `df-option` uses `selected` + `active` (ARIA sense:
selected = chosen, active = keyboard-highlighted). `df-list-item` uses `active` to mean
*chosen*. `df-tab` uses `active` for the selected tab. Same word, two meanings.

**Identity/value model is untyped and uneven.** `df-option.value: unknown`, `df-select`
emits `unknown`, `df-tab.value: string`, `df-list-item` has no value, `BreadcrumbItem.data:
unknown`. Nothing is generic, so the most important value in the kit — a select's selection —
has **no type safety**. A distributable kit should be `DfSelect<T>` / `SelectOption<T>`.

**`df-chip` conflates two axes into one `type`.** `type` mixes appearance (`default`/`active`)
with structure (`tag` → leading hash icon; `action` → trailing remove button), and the
`closed` output **only fires for `type="action"`**. You can't have a removable chip that
isn't `action`-styled. These are orthogonal: appearance, has-leading-icon, removable. Split
them (`variant` + `removable` + leading slot).

**Danger/error intent is named three ways and missing on rows.** Destructive/error "red" is
expressed as `danger` (`button`/`icon-button`/`menu-item`), `destructive` (`modal`/`dialog`),
and `error` (`toast`/`status-tag`/field validation) — three words for two distinct concepts:
**action intent** (this action destroys) vs **status/severity** (this thing failed). It's also
absent where rows live (`list-item`, `option`) and on `snackbar`/`checkbox`/`toggle`. Resolved
convention: a shared **`tone` axis** (`'default' | 'danger'`, one word kit-wide) for action
intent, separate from the `info/success/warning/error` **status** scale — both on the
`--color--semantic--error*` family. `df-list-item` now carries `tone` as the reference; migrate
`button`/`menu-item` to the orthogonal `tone` and alias `destructive` → `danger`. See
[CONVENTIONS §6](./CONVENTIONS.md).

---

## 6. Components a "complete" kit will be expected to have

Not all required — scope decisions — but a consumer will look for these and their absence is
"missing" until explicitly declared out of scope:

- **Forms:** radio + radio-group, textarea, slider/range, segmented control, date/time picker,
  file-upload, search field, form-field wrapper (unify the `dfLabel/dfHint/dfError` pattern).
- **Data:** table / data-grid, pagination, tree, empty-state, badge (distinct from chip/tag),
  progress bar + a real spinner component (today it's the `.df-spinner` CSS class only),
  skeleton component (today a CSS class only).
- **Containers/overlay:** accordion / disclosure, drawer / sheet / side-panel, generic popover
  (vs the menu/tooltip specifics), generic divider (there are `nav-divider` + `menu-divider`
  but no general one), tabs panel association (`tab-list` selects but there's no `tab-panel`
  wiring with `aria-controls`).
- **Navigation:** link component, pagination, stepper.

---

## 7. Why this matters for distribution specifically

In-repo, one team absorbs these quirks. **Distributed, every quirk is multiplied by every
consumer** and frozen by SemVer — fixing §1–§5 *after* publish are breaking changes. The
cheapest time to set one content model, one icon rule, one collection rule, one output
convention, and one value-typing approach is **now, before the first version is tagged.**

Suggested order:
1. Lock the **content-model convention** (§1) and the **icon/adornment convention** (§2);
   refit every component to it. This is the big one and the most breaking.
2. Resolve **`df-select` ↔ `df-option`** composability + generic typing (§3, §6-value).
3. Rebuild **`df-list-item`** into a real row primitive and reconcile it with `df-option` /
   `df-menu-item` (§4).
4. Normalize **`disabled`**, **output names**, and **selection vocabulary** (§5).
5. Decide the **component scope** (§6) and write down what's intentionally excluded.

These supersede the lighter "API-surface findings" in [DISTRIBUTION.md](./DISTRIBUTION.md) §3
— that table lists symptoms; this doc is the underlying disease.
