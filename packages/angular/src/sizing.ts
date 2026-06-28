/**
 * The shared control density scale. Every interactive control accepts a `size`
 * of this type so controls at the same size align side-by-side.
 *
 * `xs` 24 · `sm` 28 · `md` 32 (default) · `lg` 40 — see the `--control-*` tokens
 * in `_controls.scss` and docs/FOUNDATIONS-DENSITY.md.
 */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';
