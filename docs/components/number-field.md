# Number field: `<lucent-number-field>`

> A control for a numeric value: type it, step it with the keyboard or the buttons, with optional bounds and a unit. Built for dense tools where x, y, width and opacity fields are everywhere.

**Tier:** Form input (the `forms` group)
**Selector:** Angular `lucent-number-field`, React `<NumberField>`
**Status:** defined, not implemented

## What it is

A text input with spinbutton semantics. It is not the native `<input type="number">`, which reacts to the
mouse wheel, behaves differently across locales and is inconsistent for screen readers. The editable part is
a text input; the behavior comes from the `spinbutton@1` pattern, so the component carries no logic of its own.

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input and output | `number` | none | Paired with `valueChange` |
| `step` | input | `number` | `1` | Arrow step, and the decimals the value is rounded to |
| `min`, `max` | input | `number` | none | Bounds, applied when the user changes the value |
| `unit` | input | `string` | none | Shorthand for the `unit` slot |
| `size` | axis | `ControlSize` | `md` | `xs`, `sm`, `md`, `lg`, bound to the control sizes |
| `steppers` | axis | `end`, `sides`, `none` | `end` | A stacked pair at the end, minus and plus on the sides, or no buttons |
| `disabled`, `readonly` | input | `boolean` | `false` | Reflect states of the same name |
| `ariaLabel` | input | `string` | none | Accessible name when used outside a Field |
| `valueChange` | output | `number` | none | Emitted when a change is committed |

**Slots:** `leading` (content: an axis letter or an icon) and `unit` (text, not content). The unit is a text slot
because the pattern reads it to build `aria-valuetext`; opaque content could not feed that.

**States:** `hover`, `focus-visible`, `disabled`, `readonly` and `invalid` (reflects `aria-invalid`, set by a Field).

## Structure (aspirational FDL)

```fdl
component number-field "Number field" {
  axis size = xs | sm | md* | lg binds @control
  axis steppers = end* | sides | none

  prop value: number
  prop step: number = 1
  prop min: number
  prop max: number
  prop unit: string shorthand-for slot unit
  prop disabled: boolean = false reflects disabled
  prop readonly: boolean = false reflects readonly
  event valueChange: number
  twoWay value <-> valueChange

  slot leading: content in part leading
  slot unit: text in part unit

  part root: surface row align center {
    part leading: surface row
    part decrease: surface show-when steppers = sides { part decrease-icon: icon "minus" }
    part input: surface inputType text
    part unit: text slot(unit)
    part increase: surface show-when steppers = sides { part increase-icon: icon "plus" }
    part stepper: surface column show-when steppers = end {
      part up: surface { part up-icon: icon "chevron-up" }
      part down: surface { part down-icon: icon "chevron-down" }
    }
  }

  valueContract { value: value, change: valueChange, part: input }
  behavior {
    spinbutton@1 input: input, increase: [up, increase], decrease: [down, decrease],
                 value: value, step: step, min: min, max: max, unit: unit
    fieldControl@1 part: input, labelling: for
  }
}
```

The buttons are plain surfaces: they are pointer affordances, and the pattern decides their semantics.
`increase` and `decrease` take a list of parts, because which parts exist depends on `steppers`; parts not
rendered in a variant are ignored.

## Behavior: `spinbutton@1`

**Keyboard** (on the input)

| Key | Effect |
|---|---|
| Arrow up, down | Add or subtract `step` |
| Shift with an arrow | `10` times `step` |
| Alt with an arrow | `step` divided by `10` |
| Page up, page down | `10` times `step` |
| Home, End | `min`, `max`, only when defined |
| Enter | Commits the typed text |

**Pointer.** A click on a stepper adds or subtracts `step`, and holding repeats at the kit's repeat timing. The
mouse wheel does not change the value.

**Typed text**

- Only digits, the locale's decimal separator, a minus sign and grouping separators are accepted while typing.
- Partial text is allowed while editing (`-`, `1.`, empty); it is not a value yet.
- On Enter or blur the text is parsed with the platform's `Intl`, limited to `min` and `max`, and rounded to the
  decimals of `step`.
- Text that cannot be parsed, or empty text, returns the field to the last valid value. There is no error state.
- The input sets `inputmode="decimal"`, or `numeric` when `step` is an integer and `min` is not negative.

**Events.** `valueChange` is emitted per committed change: an arrow, a stepper, Enter or blur. It is not emitted
while typing. A value set from outside is shown as given and is not clamped; the next user change is.

**ARIA on the input.** `role="spinbutton"`, `aria-valuenow`, `aria-valuemin` and `aria-valuemax` when defined, and
`aria-valuetext` as the formatted number followed by the unit. The steppers are outside the tab order.

**Read-only and disabled.** Read-only is focusable and selectable but changes nothing. Disabled is not focusable
and the steppers are inert.

## Behavior: `scrub@1` (defined, deferred)

Dragging horizontally over the `leading` region or the input changes the value, as in design tools.

| Param | Meaning |
|---|---|
| `part` | The drag handle |
| `sensitivity` | Steps per pixel |

Each tick is a committed change. Shift and Alt scale the tick like they scale the arrows, Escape cancels and
restores the starting value, and the pointer is captured while dragging. It is pointer-only; the keyboard already
has an equivalent. Not implemented in the first version.

## Usage

```html
<!-- Angular -->
<lucent-field>
  <span lucentLabel>Width</span>
  <lucent-number-field [(value)]="width" [min]="0" unit="px" />
</lucent-field>
```

```tsx
// React
<Field>
  <Field.Label>Width</Field.Label>
  <NumberField value={width} onValueChange={setWidth} min={0} unit="px" />
</Field>
```

## Composition

- Declares `fieldControl@1` with the input as the part and `labelling: for`, so it works inside a
  [Field](./field.md) with no extra wiring.
- The frame uses the same frame tokens as `text-input`, so the two look alike without sharing a component.
- No instances: the steppers are surfaces, not `icon-button`s.

## States & accessibility

- A Field or `ariaLabel` gives the accessible name.
- The value is exposed as a number with its unit, not as raw text.
- Range and step are exposed through the ARIA value attributes, so assistive technology can announce limits.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| `ControlSize` density axis | Conforms | `size` binds the control sizes |
| State vocabulary | Conforms | `disabled`, `readonly`, `invalid` |
| Output naming | Conforms | `valueChange`, as the value contract expects |
| Tokens only | Conforms | Reuses the control frame tokens |
| Accessibility | Open | Announcement of out-of-range commits is not decided |

## Model needs

- `spinbutton@1` with typed params: part references, **lists** of parts (`increase`, `decrease`), references to
  props (`value`, `step`, `min`, `max`) and to a text slot (`unit`). Pattern params are untyped today.
- `scrub@1`, later.
- Nothing new in nodes: `inputType text` and cell-based `show-when` already exist.

## Out of scope

Expressions such as `10+5`, the mixed state for multiple selection (it returns with the inspector), unit
conversion, snapping to multiples of `step`, currency and percent formatting, and the scrub implementation.

## Notes / TODO

- Next in wave 1: search field and the accordion group.
