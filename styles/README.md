# styles/: the framework-neutral base

The single shared source of truth for Lucent's look: **design tokens + component
styles, authored as plain CSS** (no SCSS, no build step). The Angular kit consumes
this directory and emits `lucent-` class names, so one stylesheet styles it. This is the
"consume from one source" contract: packages hold framework-specific
*implementations* only; appearance lives here.

> **Class contract:** a component's CSS class is the kebab-case of its type name:
> `LucentButton` → `.lucent-button`, `LucentTextInput` → `.lucent-text-input`. The
> kit emits these, and it ships no component CSS of its own.

## Why plain CSS (no SCSS)

The whole system used exactly one SCSS feature (a single `@mixin dark`) and
otherwise was already plain CSS (runtime `var()`, native `oklch(from …)`, nesting).
Dropping SCSS removes the build toolchain entirely: these files ship as-is. The lone
cost is in `tokens/themes.css`, where the dark block is written twice (a normal
selector + an `@media` rule can't share one declaration block in plain CSS).

## Layout

```
styles/
  core.css              ← tokens + the 40 components every product needs
  packs/
    messaging.css       ← conversation UI (9)
    temporal.css        ← date & time (3)
    scheduler.css       ← events + Month/Week/Agenda views (2)
    daw.css             ← audio-workstation controls (6), not in lucent.css
  lucent.css            ← core + every pack, for consumers that want the lot
  tokens/
    primitives.css      ← Tier 1: raw scales (--color--primitive--*, --dimension--primitive--*, fonts)
    semantic-colors.css ← Tier 2: --color--semantic--* roles
    surfaces.css        ← semantic surfaces + .surface-* utilities
    borders.css         ← semantic borders, --border-*/--radius-* composites + utilities
    shadows.css         ← --shadow-* composites + .shadow-* utilities
    typography.css      ← --typography--* roles + .typography-* utilities
    controls.css        ← control-density alias (--control-*), the row-alignment contract
    layers.css          ← --layer-* stacking scale (sticky → modal → popover → tooltip → toast)
    event-categories.css← scheduler/calendar event category colours
    themes.css          ← dark-theme overrides ([data-theme=dark] + prefers-color-scheme)
  components/
    button.css          ← .lucent-button …
    text-input.css      ← .lucent-text-input …
    …                     one file per component (54 in total)
```

## Core and packs

`core.css` is the base. A component belongs in core when it needs no concept from
outside the design system to be meaningful: a button is defined by its form. A pack
component presupposes a domain: `scheduler` presupposes events with a start and an end,
`composer` presupposes messages, `date-picker` presupposes a calendar. Read the core list
and you cannot name the industry; read a pack list and you can.

That test, not "which components are common", is what decides membership, and
it is not interactivity: `modal`, `select` and `menu` are interactive and are core, while
`message-bubble` is a styled container and is not.

Packs are a partition, not a tagging scheme: a component ships in exactly one. Import
`core.css` plus the packs you use.

## Token tiers

Two published tiers (**primitive → semantic**) plus a **control-density alias**
(`--control-*`) that sits between semantic and components for cross-control row
alignment. There is **no component-token tier**; components bind straight to semantic
+ control tokens (with private `--_` locals inside each component).

## Consuming

- **Angular** imports the stylesheets once, globally.

Prefer `core.css` plus explicit packs over `lucent.css`. A product that uses core
components only pays about 25% more stylesheet with `lucent.css`, for domains it never
touches.

The kit carries no per-component CSS. A component's appearance is added here, once, and
the kit picks it up by emitting the class.
