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

Defined in [`_controls.scss`](../_controls.scss) (loaded in `styles.scss` after `typography`,
before `themes`). Each property has one token per size, resolving to existing primitives:

```scss
--control-height-xs … -lg     // sizing-6 / -7 / -8 / -10  → 24 / 28 / 32 / 40
--control-text-xs … -lg       // fs-11 / fs-caption / fs-body-sm / fs-body-md → 11 / 12 / 14 / 16
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

1. **Class:** `readonly size = input<ControlSize>('md')` + host class `df-<comp>--{{size}}`
   (merge into the existing `[class]` binding, like `button`/`chip`, or add a `host` block,
   like `input`/`select`).
2. **SCSS:** set local `--_*` vars to the `md` tokens on `:host`, override them per size class,
   and have the inner element read the local vars. Copy `button.scss`:

```scss
:host {
  --_h: var(--control-height-md);  --_text: var(--control-text-md);
  --_radius: var(--control-radius-md);  --_gap: var(--control-gap-md);
  --_px: var(--control-pad-x-md);
}
:host.df-thing--xs { --_h: var(--control-height-xs); --_text: var(--control-text-xs); /* … */ }
:host.df-thing--sm { /* … */ }
:host.df-thing--lg { /* … */ }

.df-thing__inner { height: var(--_h); padding: 0 var(--_px); gap: var(--_gap);
                   border-radius: var(--_radius); font-size: var(--_text); }
```

Buttons override `--_px` with a roomier scale; checkboxes use explicit-px box/icon vars
(`--_box`/`--_icon`) because a square doesn't map onto the height scale, while their label/gap
still follow the shared tokens.

## Current coverage

| Status | Controls |
|---|---|
| ✅ on `ControlSize` | `button`, `input`, `select`, `chip`, `checkbox` |
| ⚠️ own scale (migrate) | `icon-button` (`sm/md/lg`), `toggle` (`sm/md`), `tab` (`xs/sm/md/lg`), `avatar` (`xs/sm/md/lg`) |
| n/a | `icon` (`xs…xl` glyph sizes — a different axis) |

## Roadmap

- **Migrate the ⚠️ controls** onto `ControlSize` (align their host classes + consume the
  `--control-*` tokens). Keep their current names as deprecated aliases for one minor.
- **Container density (later):** a `[dfDensity]` / `data-density` attribute on a panel could
  set `--control-height` (etc.) via the CSS cascade, so an entire inspector goes dense in one
  line without setting `size` on each control. The token-set design above makes this a free
  follow-up — start per-control, add the container override when a real need appears.
- **Add `2xs` (20px)** only if toolbars need it; don't add speculatively.

See [CONVENTIONS §10](./CONVENTIONS.md) for the rule and [COMPONENTS-ROADMAP.md](./COMPONENTS-ROADMAP.md)
for where density sits in the broader plan.
