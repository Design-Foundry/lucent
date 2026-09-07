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
