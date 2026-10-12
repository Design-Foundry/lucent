# Accordion: `<lucent-accordion>`

> A group of [accordion items](./accordion-item.md) that coordinates which one is open and moves focus between their headers.

**Tier:** Container
**Selector:** Angular `lucent-accordion` holding `lucent-accordion-item`, React `<Accordion>` holding `<AccordionItem>`
**Status:** defined, not implemented

## What it is

The group half of the accordion. The item already exists as a single disclosure; the group adds what a set of
items needs: one-open-at-a-time, keyboard movement between headers, and a common look. An item used alone is a
disclosure, so there is no separate Disclosure component.

## API

**Accordion (the group)**

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input and output | `string` | none | The open item's `value`. Single mode only; paired with `valueChange` |
| `multiple` | input | `boolean` | `false` | Several items open at once. The group then holds no value |
| `collapsible` | input | `boolean` | `true` | Choosing the open item closes it. With `false`, once an item is open one stays open |
| `headingLevel` | input | `number` | `3` | Level of the heading around each header, 2 to 6 |
| `valueChange` | output | `string` | none | Emitted when the open item changes |

**Slots:** `items`, a closed set of `accordion-item`, as the catch-all slot.

**Accordion item** (see [accordion-item.md](./accordion-item.md))

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input | `string` | none | Identifies the item. Required inside a group |
| `title` | input | `string` | `''` | Shorthand for the `title` text slot |
| `expanded` | input and output | `boolean` | `false` | Paired with `expandedChange` |
| `disabled` | input | `boolean` | `false` | Header not togglable |
| `headingLevel` | input | `number` | `3` | Used when the item is alone; inside a group the group's value wins |

**Slots of the item:** `title` (text) and `body` (content, catch-all).

## Structure (aspirational FDL)

```fdl
component accordion "Accordion" {
  prop value: string
  prop multiple: boolean = false
  prop collapsible: boolean = true
  prop headingLevel: number = 3
  event valueChange: string
  twoWay value <-> valueChange

  slot items: component list body allows accordion-item in part root
  part root: surface column

  behavior {
    selection@1 slot: items, value: value, toggle: collapsible, multiple: multiple
    listNavigation@1 slot: items, orientation: vertical, focus: move, skipDisabled: true
  }
}

component accordion-item "Accordion item" {
  prop value: string
  prop title: string shorthand-for slot title
  prop expanded: boolean = false reflects expanded
  prop disabled: boolean = false reflects disabled
  prop headingLevel: number = 3
  event expandedChange: boolean
  event toggle
  twoWay expanded <-> expandedChange

  slot title: text in part title
  slot body: content body in part content

  state expanded: logical (aria aria-expanded)
  state disabled: logical

  part root: surface column {
    part header: surface row align center justify spaceBetween {
      on-click -> emit toggle
      part title: text slot(title)
      part chevron: icon "chevron-down"
    }
    part content: surface column show-when expanded
  }

  behavior { selection@1 value: value, choose: toggle, selected: expanded }
}
```

## Behavior

**Single mode** (`multiple` is `false`)

- Choosing an item opens it and closes the one that was open. The group's `value` follows.
- Choosing the open item closes it when `collapsible` is `true`, and does nothing when it is `false`.
- With `collapsible` `false` and no `value` set, every item starts closed; after the first choice one always stays open.
- The group owns the expanded state of its items. An `expanded` binding on an item inside a single-mode group is
  ignored, and the kit warns in development.

**Multiple mode.** Items are independent and each keeps its own `expanded`. The group holds no value and provides
only keyboard movement and the common look.

**An item alone** toggles itself. The `selection@1` pattern defines that standalone behavior: with no parent, choosing
the item flips its own state. Controlled use through `expanded` still works.

**Keyboard**

| Key | Effect |
|---|---|
| Tab | Moves through the headers; each header stays in the tab order |
| Enter, Space | Toggles the focused item |
| Arrow down, arrow up | Moves focus to the next or previous enabled header, without wrapping |
| Home, End | Moves focus to the first or last enabled header |

The arrows are an addition: all the headers remain reachable with Tab.

## Usage

```html
<!-- Angular -->
<lucent-accordion [(value)]="open" headingLevel="2">
  <lucent-accordion-item value="shipping" title="Shipping">Ships in 2 to 3 business days.</lucent-accordion-item>
  <lucent-accordion-item value="returns" title="Returns">Free within 30 days.</lucent-accordion-item>
</lucent-accordion>
```

```tsx
// React
<Accordion value={open} onValueChange={setOpen} headingLevel={2}>
  <AccordionItem value="shipping" title="Shipping">Ships in 2 to 3 business days.</AccordionItem>
  <AccordionItem value="returns" title="Returns">Free within 30 days.</AccordionItem>
</Accordion>
```

## Composition

- The first component to use Participation without an overlay: the group coordinates, the items declare.
  The `selection@1` pattern is the one `select`, `radio-group` and `tab-list` will share.
- The `items` slot is a closed set, so the group knows its children and the kit validates them.
- Separators belong to the items, so a lone item looks the same as one in a group.

## States & accessibility

- Each header is a button inside a heading of the configured level, with `aria-expanded` and `aria-controls`.
- The panel is a `role="region"` labelled by its header, and collapsed panels are `hidden`.
- Open question: the W3C guide advises dropping the region role when a group has many items, to avoid a long
  list of landmarks. The kit keeps the region always for now.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| Content model (projection) | Conforms | The body is the item's catch-all slot |
| State vocabulary | Conforms | `expanded`, `disabled`, two-way |
| Output naming | Conforms | `valueChange`, `expandedChange` |
| Accessibility | Open | Heading around the header is new to the kit; region count undecided |

## Model needs

- `selection@1` extended with `toggle` and `multiple`, and a defined standalone behavior (a lone child toggles
  itself). This amends two rules of the 0.8 proposal: that the child never writes its selected state, and that the
  selected state stays off without a parent.
- `listNavigation@1` params for moving focus without roving the tab index, skipping disabled participants.
- Typed pattern params: references to slots and props.
- Element semantics for a part, so the header can be a button inside a heading of a given level. The model defines
  a role only for the whole component.
- List-valued props, so a multiple-mode group could hold its open items. Deferred; items keep their own state.

## Out of scope

Height animation (animations are reserved in the model), adornments in the header (a leading icon or a count),
an expand-all control, and deep nesting guidance.

## Notes / TODO

- With this page wave 1 is defined: Field, Number field, Search field and the accordion group. Label is covered by
  Field.
