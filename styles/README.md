# styles/ — the framework-neutral base

The single shared source of truth for Lucent's look: **design tokens + component
styles, authored as plain CSS** (no SCSS, no build step). All four kits — Angular,
React, Web Components, and the Razor RCL — consume this directory and emit identical
`lucent-` class names, so one stylesheet styles every one of them. This is the
"consume from one source" contract: packages hold framework-specific
*implementations* only; appearance lives here.

> **Class contract:** a component's CSS class is the kebab-case of its type name —
> `LucentButton` → `.lucent-button`, `LucentTextInput` → `.lucent-text-input`. All
> four kits emit these, and no kit ships component CSS of its own.

## Why plain CSS (no SCSS)

The whole system used exactly one SCSS feature — a single `@mixin dark` — and
otherwise was already plain CSS (runtime `var()`, native `oklch(from …)`, nesting).
Dropping SCSS removes the build toolchain entirely: these files ship as-is. The lone
cost is in `tokens/themes.css`, where the dark block is written twice (a normal
selector + an `@media` rule can't share one declaration block in plain CSS).

## Layout

```
styles/
  lucent.css            ← single entry; @imports everything in cascade order
  tokens/
    primitives.css      ← Tier 1: raw scales (--color--primitive--*, --dimension--primitive--*, fonts)
    semantic-colors.css ← Tier 2: --color--semantic--* roles
    surfaces.css        ← semantic surfaces + .surface-* utilities
    borders.css         ← semantic borders, --border-*/--radius-* composites + utilities
    shadows.css         ← --shadow-* composites + .shadow-* utilities
    typography.css      ← --typography--* roles + .typography-* utilities
    controls.css        ← control-density alias (--control-*) — the row-alignment contract
    layers.css          ← --layer-* stacking scale (sticky → modal → popover → tooltip → toast)
    event-categories.css← scheduler/calendar event category colours
    themes.css          ← dark-theme overrides ([data-theme=dark] + prefers-color-scheme)
  components/
    button.css          ← .lucent-button …
    text-input.css      ← .lucent-text-input …
    …                     one file per component (58 in total)
```

## Token tiers

Two published tiers — **primitive → semantic** — plus a **control-density alias**
(`--control-*`) that sits between semantic and components for cross-control row
alignment. There is **no component-token tier**; components bind straight to semantic
+ control tokens (with private `--_` locals inside each component). See
[../docs/CONVENTIONS.md](../docs/CONVENTIONS.md).

## Consuming

- **Razor RCL** (`packages/razor`) ships `lucent.css` as a static web asset under
  `_content/DesignFoundry.Lucent/`; the consuming app links it once.
- **Angular, React, Web Components** import `lucent.css` once, globally. The Web
  Components kit renders into the **light DOM** precisely so this global sheet still
  reaches it.

No kit carries per-component CSS. A component's appearance is added here, once, and
every kit picks it up by emitting the class.
