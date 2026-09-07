# Foundations — Density & sizing

Why the kit has a control-size scale, what the tokens are, and how to apply them. This is the
single most important foundation for our domain: Design Foundry is a **dense, control-heavy
tool** (closer to Figma/Linear than to a SaaS dashboard). A one-height-fits-all control set
produces tall layouts you can't pair side-by-side. Density is a first-class API, not an
afterthought.

> **Anchor systems:** sizing here follows **Fluent 2** (explicit `size` props, productivity
> density) and **Apple AppKit** (`controlSize`: mini/small/regular/large) — the two systems
> built for dense desktop tools. Material/HIG-touch are deliberately *not* the sizing model.

---

## The scale

One scale, used by every interactive control. `md` is the default and equals the kit's
historical 32px height, so existing screens are unchanged; panels opt down, forms opt up.

| `size` | height | text | icon | radius | pad-x (field) | gap | typical use |
|---|---|---|---|---|---|---|---|
| `xs` | 24 | 11 | 14 | 4 | 8 | 4 | toolbars, property rows, ultra-dense clusters |
| `sm` | 28 | 12 | 16 | 4 | 10 | 4 | dense panels / inspectors |
| `md` | **32** | 14 | 16 | 8 | 12 | 6 | **default** — general UI |
| `lg` | 40 | 16 | 24 | 8 | 16 | 8 | forms, primary CTAs, touch targets |

Control text uses tight single-line line-height (`--control-line` ≈ 1.15), never the reading
line-height. The text sizes sit in the dense 11–14 band — see
[FOUNDATIONS-TYPOGRAPHY.md](./FOUNDATIONS-TYPOGRAPHY.md).

**The alignment contract** — what guarantees side-by-side pairing — is **height + text + icon
+ radius + gap**. Inline padding is a *field baseline*; buttons intentionally run wider (they
own their own `--_px`), which is why buttons and inputs at the same size still share a height
but not a horizontal padding.

## Tokens

Defined in [`controls.css`](../styles/tokens/controls.css) (loaded from `lucent.css` after `typography`,
before `themes`). Each property has one token per size, resolving to existing primitives:

```css
--control-height-xs … -lg     // sizing-6 / -7 / -8 / -10  → 24 / 28 / 32 / 40
--control-text-xs … -lg       // fs-2xs / fs-xs / fs-sm / fs-md → 11 / 12 / 14 / 16 (one step down)
--control-icon-xs … -lg       // icon-sm / -md / -md / -lg
--control-radius-xs … -lg     // radius-xs / -xs / -sm / -sm
--control-pad-x-xs … -lg      // spacing-2 / -2.5 / -3 / -4
--control-gap-xs … -lg        // spacing-1 / -1 / -1.5 / -2
--control-line                // lh-snug (1.15) — single-line control text
```

The TypeScript counterpart is `ControlSize` (exported from the kit root):

```ts
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';
```

## How the values are curated

The scale looks like it should come from a formula. It does not, and that is deliberate —
the ratios do not close. Text-to-height runs .458 → .429 → .4375 → .400; the free space runs
13 → 16 → 18 → 24. Neither is a series. Three rules generate the table instead.

**1. The scale never invents a value.** All 25 control tokens resolve to an existing
primitive; not one holds a literal. Density is a way of *choosing* among steps that already
exist, never a second source of sizes competing with the primitive scales.

**2. A facet moves only when its own scale offers a step that reads as different.** This is
why some rows repeat, and the repeats are not oversights:

- `icon` — the glyph scale is `10 · 14 · 16 · 24 · 32`. There is no 20, so `sm` and `md`
  share 16. At control sizes a 16px and a 20px glyph are not tellable apart in a row, which
  is why the scale is coarse in the first place.
- `radius` — the scale is `4 · 8 · 16 · 24 · 32 · full`. `lg` holds at 8 because the next
  step is 16, which on a 40px control reads as a pill: too round for a dense tool.

**3. Heights are borrowed, not derived.** `24 · 32 · 40` are Fluent 2's small / medium /
large. `28` is inserted for dense panels. "Why 28 and not 30" is answered by the anchor
system, which is a reviewable answer rather than a matter of taste.

## Container, content, and the relation between them

The facets are not one undifferentiated set. They fall into three roles, and the split
explains the scale's one real exception.

| role | facets | who decides |
|---|---|---|
| **container** | height, radius | the system — fixed |
| **content** | text, icon | fitted into the container |
| **content ↔ content** | gap | the system — part of the contract |
| **content ↔ container** | pad-x | the component may renegotiate |

**The container is primary and the content is fitted into it**, not the other way round.
Controls set `height` and centre their content: `padding: 0 var(--_px)` with
`align-items: center`. There is no vertical spacing token anywhere in the scale — the space
above and below the text is a *residue* of centring. At `xs` it is (24 − 11 × 1.15) / 2 =
5.67px: off-grid, unnamed, and never authored. Row height has to be predictable for
side-by-side pairing to work at all, so it is chosen first and the type is curated to sit
well inside it.

That is also why inline padding sits outside the alignment contract while `gap` sits inside
it. `gap` separates content from content, so two controls at the same size keep the same
internal rhythm. `pad-x` separates content from the edge of its own box — a relation, and
relations are negotiable. A button can ask for more air without breaking anything a
neighbouring input depends on.

### This is checked, not asserted

Across the 63 component stylesheets, `--_px` is the **only** facet any component sets to
something other than a `--control-*` token — four declarations, all in `button.css`, and all
still resolving to `spacing-*` primitives rather than literals. `--_h`, `--_radius`,
`--_text` and `--_gap` are taken from the control tokens without a single exception.

The check is worth re-running when the scale changes:

```bash
for n in _px _gap _h _radius _text; do
  tot=$(grep -rhE "^\s*--$n:" styles/components/*.css | wc -l)
  ctl=$(grep -rhE "^\s*--$n: *var\(--control-" styles/components/*.css | wc -l)
  echo "--$n: $((tot-ctl)) renegotiated of $tot"
done
```

## Applying it to a component

1. **Class:** `readonly size = input<ControlSize>('md')` + host class `lucent-<comp>--{{size}}`
   (merge into the existing `[class]` binding, like `button`/`chip`, or add a `host` block,
   like `input`/`select`).
2. **CSS:** in `styles/components/<comp>.css`, set local `--_*` vars to the `md` tokens on the
   block class, override them per size class, and have the inner element read the local vars.
   Copy `styles/components/button.css`:

```css
.lucent-thing {
  --_h: var(--control-height-md);  --_text: var(--control-text-md);
  --_radius: var(--control-radius-md);  --_gap: var(--control-gap-md);
  --_px: var(--control-pad-x-md);
}
.lucent-thing--xs { --_h: var(--control-height-xs); --_text: var(--control-text-xs); /* … */ }
.lucent-thing--sm { /* … */ }
.lucent-thing--lg { /* … */ }

.lucent-thing__inner { height: var(--_h); padding: 0 var(--_px); gap: var(--_gap);
                   border-radius: var(--_radius); font-size: var(--_text); }
```

Buttons override `--_px` with a roomier scale; checkboxes use explicit-px box/icon vars
(`--_box`/`--_icon`) because a square doesn't map onto the height scale, while their label/gap
still follow the shared tokens.

## Exceptions

`icon` sizes on a separate `xs…xl` glyph axis — a glyph is not a control, and forcing it onto
`ControlSize` would tie icon scale to row height, which is exactly the coupling this scale
exists to avoid.

See [CONVENTIONS §10](./CONVENTIONS.md) for the rule.
