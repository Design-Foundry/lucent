# Lucent mark

Five sheets fanned from one pivot, slate to neutral. Generated from the primitive tokens by `node brand/build.mjs`; edit the script, not the SVGs.

## Variants

| File | Use |
|---|---|
| `lucent-mark.svg` | Full color on light surfaces (sage, pine). Needs a tinted surface; on pure white the lightest sheets disappear. |
| `lucent-mark-dark.svg` | Full color on dark surfaces. |
| `lucent-mark-slate.svg` | One color on light surfaces. |
| `lucent-mark-white.svg` | One color on dark and pine surfaces. |
| `lucent-mark-solid-{size}.svg` | Single ink, sheets separated by cuts. Paints `currentColor`. |
| `lucent-tile.svg`, `lucent-tile-dark.svg` | Three sheets on a sage-95 or neutral-10 tile, for app icons and near-white surfaces. |
| `lucent-wordmark.svg`, `lucent-wordmark-white.svg` | Outfit Light, respaced: L foot shortened, L-u closed, light overall tightening. |
| `lucent-lockup.svg`, `lucent-lockup-dark.svg` | Tile and wordmark. Cap height is half the tile, gap is a quarter tile. |
| `favicon.svg` | The tile, following `prefers-color-scheme`. |

Each color variant has a `-small` file with three sheets. Use it at 32px and below.

## Solid cuts

The cut width depends on the rendered size, so the solid mark ships one file per size.

| Size | Sheets | Cut |
|---|---|---|
| 16px | 3 | 1px |
| 24px | 3 | 1px |
| 32px | 3 | 1.5px |
| 48px | 5 | 2px |
| 64px | 5 | 2px |
| 96px | 5 | 3px |

For other sizes, use about size / 32, never under 1px.
