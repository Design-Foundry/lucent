# Accordion item — `<lucent-accordion-item>`

> A single disclosure: a header that expands/collapses a content region. Used alone it is a
> disclosure; inside an [accordion](./accordion.md) group it is one item of the classic accordion —
> progressive disclosure for long or optional content (FAQs, settings groups, details you don't
> want crowding the first read).

## Changes defined in wave 1

Renamed from `lucent-accordion`, which is now the group. Not implemented yet.

- New `value` input (string). Required for an item inside a group; optional when used alone.
- Joins the group through the `selection@1` pattern. Inside a single-mode group the group owns the
  expanded state; inside a `multiple` group, and when used alone, the item toggles itself.
- The header sits inside a heading whose level comes from the group's `headingLevel` (default `3`),
  or from the item's own `headingLevel` when used alone.
- `title` becomes a text slot with the shorthand input kept.

**Tier:** Container
**Targets:** `LucentAccordion` (Angular · `lucent-accordion`) · `Accordion` (React) · `<lucent-accordion>` (Web Components) · `LucentAccordion` (Blazor)
**Source:** [`../../packages/angular/src/accordion/accordion.ts`](../../packages/angular/src/accordion/accordion.ts) · CSS [`../../styles/components/accordion.css`](../../styles/components/accordion.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `title` / `heading` | input | `string` | `''` | Header text (`title` in Angular/React/Blazor; `heading` in WC) |
| `expanded` / `open` | model / input | `boolean` | `false` | Two-way; `open` in WC, `Expanded` in Blazor |
| `disabled` | input | `boolean` | `false` | Header not togglable |

**Content:** the collapsible body projects as children (`<ng-content>` / `children` / light DOM / `ChildContent`).

## When to use

- **Optional or lengthy content** that shouldn't dominate the first read — FAQs, advanced
  settings, secondary detail.
- Put several in an [accordion](./accordion.md) group. "Only one open at a time" is the group's
  `multiple` and `collapsible` inputs, not something the usage site coordinates.
- Don't hide **essential** content behind a disclosure, and don't nest accordions deeply.

## Usage

```html
<!-- Angular -->
<lucent-accordion title="Shipping" [(expanded)]="open">
  Ships in 2–3 business days.
</lucent-accordion>
```
```tsx
/* React (uncontrolled) */
<Accordion title="Shipping" defaultExpanded>Ships in 2–3 business days.</Accordion>
```
```html
<!-- Web Components -->
<lucent-accordion heading="Shipping" open>Ships in 2–3 business days.</lucent-accordion>
```
```razor
@* Blazor *@
<LucentAccordion Title="Shipping" @bind-Expanded="open">Ships in 2–3 business days.</LucentAccordion>
```

## Composition

- Renders a header `<button>` (title + chevron `lucent-icon`) and a `role="region"` content
  panel linked by `aria-controls`/`aria-labelledby`.
- The WC kit extends `LucentSurface` and builds the header imperatively so the authored
  light-DOM content is preserved live (not re-parsed).

## States & accessibility

- Header is a `<button>` with `aria-expanded`; the panel is `role="region"` labelled by the
  header. Collapsed content uses the `hidden` attribute (removed from the a11y tree and tab order).
- The chevron rotates on expand; state is also conveyed by `aria-expanded` (not colour alone).
- `disabled` prevents toggling.

## Do / Don't

- **Do** keep headers short and scannable; let the body hold the detail.
- **Do** use the accordion group when you need single-open behaviour.
- **Don't** bury essential content or form errors inside a collapsed panel.
- **Don't** deeply nest accordions — reconsider the information architecture instead.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-accordion-item`, `__header`, `is-expanded`) | ✅ | Class names follow the rename |
| §5 content model (projected body) | ✅ | Children in every kit |
| §6 state (`expanded`/`disabled`, two-way) | ✅ | |
| §7 a11y (`aria-expanded`/`region`/`hidden`) | ✅ | |
| §8 tokens | ✅ | Border `border-subtle`, text roles |

## Notes / TODO

- Height animation on expand/collapse is a possible enhancement (today it's an instant
  show/hide via `hidden`). The Blazor toggle needs an interactive render mode.
