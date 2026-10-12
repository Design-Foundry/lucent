# Parked: named layout presets

Parked 2026-10-11. Nothing here is decided or scheduled. This page keeps the analysis so it can be
picked up again without redoing it.

## The question

Should Lucent offer layout building blocks (`stack`, `row`, `cluster`, `grid`, `split`, `box`) the way
Carbon, Primer, Polaris or Atlassian do, or is that just another utility-class layer like Tailwind?

## Three levels

| Level | What it exposes | Example | Who does it |
|---|---|---|---|
| 1. Mechanical | CSS properties as classes | `flex`, `items-center`, `gap-4`, `p-4` | Tailwind |
| 2. Intent | A few named layouts, each with one or two knobs | `stack`, `cluster`, `sidebar` | Every Layout, Polaris (`BlockStack`, `InlineStack`), Atlassian (`Stack`, `Inline`) |
| 3. Pattern | A whole structure with content and rules | property row, inspector, form layout, app shell | Components |

Level 2 is what was examined. Level 3 is not layout: those are components already on the Lucent list
(Property row, Inspector, Toolbar, Field, Form, resizable panels).

## The six presets that were considered

| Name | Intent | Knobs |
|---|---|---|
| `stack` | Items stacked vertically at a constant rhythm (forms, sections) | `gap` |
| `row` | Items in a line that does not wrap | `gap`, `align` |
| `cluster` | A row that wraps (chips, buttons, tags) | `gap`, `align` |
| `grid` | Columns that fit themselves by a minimum width | `gap`, `min` |
| `split` | Two zones, one fixed and one taking the rest (list and detail) | `gap`, which side is fixed |
| `box` | A container with padding from the scale | `inset` |

What would set them apart from Tailwind: no per-property classes and no free combinations. The only
value knob is the existing spacing scale, never an arbitrary value. The name says what you want and
the CSS stays inside. The knobs would be modifier classes following the Lucent class contract, for
example `lucent-stack lucent-stack--gap-md`. `split` was the preset most in doubt for a dense tool.

## Why it was parked

- It is close to a preset with no consumer asking for it yet.
- The design system has no home for a layout that is not a component. The authored system document
  holds `tokens`, `organization` (scales and collections), `resources` and `components`, nothing in
  between.
- Text utilities were different and went ahead: they project typography tokens that already exist
  (see [text.md](../components/text.md)). Layout presets have no token to project.

## Where it could live in the design system

| Option | Effect |
|---|---|
| A component of the system | Visible to the compiler, ripple, Design Foundry and native platforms. The utility class is just the CSS emission of the component |
| CSS only in `lucent-styles` | Cheap, but invisible to the model. The spacing scale would be mapped in two places, and Flutter or SwiftUI would not inherit it |
| A new system-level construct | A second mechanism for what a component already covers |

The preferred option was the first. A sketch (aspirational FDL, not valid today):

```fdl
component stack "Stack" {
  axis gap = xs | sm | md* | lg | xl binds @spacing
  axis align = stretch* | start | center | end

  slot body: content body in part root

  tokens {
    --gap: dimension = gap => { xs @spacing-2, sm @spacing-3, md @spacing-4, lg @spacing-6, xl @spacing-8 }
  }

  part root: surface column
  style root { gap --gap }
}
```

It reuses what exists: axes bound to a collection (as `size binds @control` does), a Content body slot,
and `gap` as a token-bound measure. Under the Lucent class contract a component already compiles to a
class plus modifier classes per axis, so the same output can be applied to the consumer's own element
with no wrapper. Kits would get a thin wrapper for free and native platforms an equivalent.

## What the model needs first

Recorded as D13 in hub `docs/model-decisions-bench.md`:

- `wrap` on node layout (a structural boolean). `cluster` needs it.
- Automatic grid columns: the structure is a mode, and the minimum width is a token-bound style
  property. `grid` needs it.
- `gap` and padding stay style properties. Layout is structure and does not vary by variant or state;
  style is bound to tokens and does. Moving them would drop token binding, axis maps, state overrides
  and the dependency edges that feed ripple and debt.

## To revive

1. Settle the composition decisions the presets rely on: Content as a slot kind, `body: true`.
2. Land `wrap` and automatic grid columns in the model (D13).
3. Decide whether a real consumer exists (a screen in `hub/web` or the playground that repeats the same
   layout CSS), so the vocabulary comes from use and not from a survey.
4. Write each preset as a component page with the standard template.
