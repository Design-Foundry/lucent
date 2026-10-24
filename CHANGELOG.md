# Changelog

All Lucent packages (`@designfoundry/lucent-styles`, `@designfoundry/lucent-angular`) are
released together on the same version. Before 1.0 a minor version may break; see
[Versions](./README.md#versions).

## 0.7.0 (2026-10-24)

A consistency pass over every component, after reviewing them side by side in the showcase.

### Changed

- **Concentric radii.** Panels that hold items (list, menu, select dropdown, time picker
  popover) use `radius-sm` with a 4px inset, and their items use `radius-xs`. List items
  were rounder than their list, and menu items had no radius.
- Date picker, date range picker and time picker triggers use the control radius, like
  text input and select.
- The select dropdown is at least as wide as its trigger, and still grows for wider
  options.
- Nav item hover uses the shared state layer instead of the rail's own surface, so it is
  visible, and it no longer overrides the active state.
- Activity bar text icon buttons use the muted ink, like nav items.
- Modal: 20px padding, header aligned to the top, close button pulled into the corner.
- Toast: the close button no longer sets the header height.
- The spinner draws one solid arc on a faint ring, instead of a ring with one faint
  quarter.
- Text selection uses `accent-subtle` behind `text-strong` everywhere.
- Text input, textarea, composer and inline input keep their own fill and ink when the
  browser autofills them.

### Fixed

- Every rule that sets `width: 100%` or `max-width: 100%` also sets
  `box-sizing: border-box`, so padded components (conversation row, nav item, text input,
  textarea and others) no longer overflow their container on pages without a global reset.
- Table header cells honour `lucent-table__cell--right` and `--center`.
- The toast message lost the browser's default paragraph margin.
- The inline notice icon is centred on the first line of text.

## 0.6.0 (2026-10-24)

First release on npm, under the `@designfoundry` scope, with provenance.

### Removed

- `lucent-nav-icon`: use `lucent-nav-item`, or `lucent-icon-button` for actions.
- `lucent-nav-divider` and `lucent-menu-divider`: use `lucent-divider`.
- Button and icon button variants `ghost` (use `text`) and `on-glass` (use `text` or
  `secondary` inside a glass surface).
- The DAW pack. It is no longer part of the published styles.

### Changed

- Packages renamed from `@design-foundry/lucent-*` on GitHub Packages to
  `@designfoundry/lucent-*` on npm.
