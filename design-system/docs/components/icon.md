# `DfIcon` — `<df-icon>`

> Renders a single Material Icons glyph by ligature name. The kit's icon primitive — every
> other component's `icon` shorthand renders one of these internally.

**Tier:** Primitive
**Selector:** `df-icon`
**Source:** [`../../icon/icon.ts`](../../icon/icon.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `name` | input | `string` | `'widgets'` | Material Icons ligature (e.g. `settings`, `more_vert`) |
| `size` | input | `IconSize` | `'md'` | Sets font-size/width/height via `--dimension--primitive--icon-*` |
| `ariaLabel` | input | `string` | `''` | Set only when the icon conveys meaning on its own |

**Content slots:** none (the glyph is the content).
**Exported types:** `IconSize = 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`

## Usage

```html
<df-icon name="settings" />
<df-icon name="error" size="lg" ariaLabel="Error" />
```

Requires the Material Icons font to be loaded globally (see [README §3](../README.md)).

## Composition

- Embedded by every component with an `icon` shorthand (`df-tab`, `df-menu-item`,
  `df-icon-button`, `df-list-item`, …) and by `df-chip` for its hash/close glyphs.
- `name` here is the **glyph source of truth**; the kit-wide `icon` _shorthand_ on other
  components (CONVENTIONS §5) maps onto this `name`.

## States & accessibility

- **Decorative by default:** `aria-hidden="true"` so screen readers skip it.
- **Meaningful:** set `ariaLabel` → host becomes `role="img"` with the label. Use only when
  the icon stands alone (no adjacent text already naming the action).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §4 signal inputs | ✅ | |
| §5 content model | n/a | Glyph primitive — no projection by design |
| §7 a11y | ✅ | Correct decorative/meaningful split |
| §8 tokens | ✅ | Sizes from `--dimension--primitive--icon-*` |

## Notes / TODO

- Material Icons is a hard runtime dependency; self-hosting/tree-shaking the icon set is a
  distribution concern (see [DISTRIBUTION.md](../DISTRIBUTION.md)).
