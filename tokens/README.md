# Tokens

The framework-neutral foundation of Lucent: design tokens expressed as CSS custom
properties (authored as SCSS partials). These are the **shared source of truth** —
consumed by both the Angular kit and the Razor RCL.

| File | Contents |
|---|---|
| `_tokens.scss` | Primitive scales — sizing, spacing, font-size, radius, icon |
| `_controls.scss` | Control density scale (`--control-*`) — the side-by-side alignment contract |
| `_typography.scss` | Type scale + text styles |
| `_semantic-colors.scss` | Semantic color roles |
| `_surfaces.scss` / `_borders.scss` / `_shadows.scss` | Surface, border, elevation tokens |
| `_themes.scss` | Light/dark theme bindings |

Every component references these purely as runtime `var(--…)` values (no
`@use`/`@import`), so the tokens are portable as-is. They compile to a single CSS
file that the Razor side consumes directly (Blazor doesn't run SCSS) — that build
step lands with the Razor RCL.
