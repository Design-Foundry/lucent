# Foundations — Typography

The type system, and how it serves a **dense, control-heavy** tool. The guiding split: most of
our text is **UI text** (single-line, in or beside a control) — not **reading text**
(multi-line prose). Those want different line-heights, so the scale separates them.

> Like density, the type ramp is anchored on **Fluent 2** (tight, absolute-ish line-heights)
> and **Material 3 / AppKit** (a dedicated `label` ramp at 11/12/14, weight 500). The big
> display sizes exist for marketing/empty-states, not app chrome.

---

## The two jobs of text

| | Reading text | UI / label text |
|---|---|---|
| Roles | `display` · `title` · `heading` · `body` · `caption` · `micro` | **`label-lg/md/sm`** |
| Line-height | comfortable (`normal` 1.4 / `relaxed` 1.6) | tight (`snug` 1.15) — `--control-line` |
| Weight | regular (400) | medium (500) |
| Where | prose, help text, doc bodies, empty states | buttons, inputs, chips, menu rows, table cells, labels |

The mistake the kit had before: controls used `caption`/`body-sm` with **reading**
line-heights (1.4–1.6), which is too loose for a single-line control and risks clipping. The
`label` family fixes that.

## The scale

Sizes (sans is default; every role also has a `-mono`; reading roles also have `-serif`):

| Role | px | line-height | weight | use |
|---|---|---|---|---|
| `display` | 96 | tight | bold | ⚠️ marketing only — **not app chrome** |
| `title-lg` | 60 | tight | bold | ⚠️ marketing / hero |
| `title-md` | 40 | snug | semibold | ⚠️ marketing / large empty-states |
| `heading-lg` | 28 | snug | regular | page titles |
| `heading-md` | 20 | normal | medium | section headings |
| `body-md` | 16 | normal | regular | reading body; `lg` control text |
| **`label-lg`** | **14** | **snug** | **medium** | **md/lg control text, field labels** |
| `body-sm` | 14 | normal | regular | dense reading body |
| `fs-13` | 13 | — | — | in-between dense step (raw size; AppKit control) |
| **`label-md`** | **12** | **snug** | **medium** | **sm control text, dense labels** |
| `caption` | 12 | relaxed | regular | helper/hint text (multi-line) |
| **`label-sm`** | **11** | **snug** | **medium** | **xs control text, toolbar/meta labels** |
| `micro` | 10 | relaxed | regular | tiniest meta / timestamps |

**The dense band is 11–14.** That's where tool UI lives (Figma UI ≈ 11px; macOS controls
11/13; Material `label-small` 11). We added **11** (`fs-11`) and **13** (`fs-13`) to fill the
old `10 → 12 → 14` gap, and the **`label`** family to give that band a tight, single-line role.

## Tracking (letter-spacing)

New primitives — small UI text and uppercase labels read better with a touch of tracking:

```
--dimension--primitive--tracking-tight: -0.01em
--dimension--primitive--tracking-normal: 0
--dimension--primitive--tracking-wide:  0.02em   // label-md / label-sm
--dimension--primitive--tracking-wider: 0.04em   // uppercase / status labels
```

`label-sm`/`label-md` carry `tracking-wide`; `label-lg` is normal.

## How controls consume it

The `--control-text-*` tokens map onto the dense band (md unchanged → non-breaking default):

| `size` | control height | text token | px |
|---|---|---|---|
| `xs` | 24 | `fs-11` | 11 |
| `sm` | 28 | `fs-caption` | 12 |
| `md` | 32 | `fs-body-sm` | 14 |
| `lg` | 40 | `fs-body-md` | 16 |

Control text uses **`--control-line` (1.15)**, never the reading line-height. See
[FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

## Usage

```html
<!-- utility class -->
<span class="typography-label-sm">OPACITY</span>
<code class="typography-label-md-mono">#0EA5E9</code>
<p class="typography-body-md">Reading text wraps comfortably…</p>
```
```css
/* or tokens directly */
.thing { font: var(--typography--label-md--font-weight) var(--typography--label-md--font-size)/var(--typography--label-md--line-height) var(--typography--label-md--font-family); }
```

## Conventions

- **UI text → `label-*`** (or the `--control-*` tokens for controls). **Reading text → body/caption.**
- **No serif labels** — the `label` family is sans + mono only (mono for hex/dimension/value
  text in a design tool).
- **Don't use `display`/`title-*` in app chrome** — they're marketing/empty-state sizes.
- New components: control/label text uses `label-*` + `--control-line`; never hardcode px or
  reuse `caption`/`body-sm` for single-line UI labels.

Outfit is a variable font with a 100–900 weight range; the system draws on 300–700 and leaves
the extremes unused — a display face's thinnest and heaviest cuts do not survive at UI sizes.
