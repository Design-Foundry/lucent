# Field: `<lucent-field>` and `<Field>`

> Logic that connects a control with its label, hint and error, and passes `invalid`, `required` and `disabled` to the control. It has no appearance and is not a component of the design system.

**Tier:** Form logic (a kit primitive in the `forms` group)
**Selector:** Angular `lucent-field`, using the existing `[lucentLabel]`, `[lucentHint]` and `[lucentError]` markers. React `<Field>` with `Field.Label`, `Field.Hint` and `Field.Error`
**Status:** defined, not implemented

## What it is, and what it is not

Field owns wiring and nothing else. It does not decide structure or style, it does not hold the value
or validate, and it has no entry in a project's component catalog in Design Foundry. Controls are the
components in the catalog; Field is the logic the compiled kit ships so any control can take a label,
a hint and an error.

| | Owns |
|---|---|
| Control | Its value, its frame, its own parts |
| Field | Ids, label association, `aria-describedby`, `invalid`, `required`, `disabled` |
| Forms layer of the framework | Value, validation, touched |

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `invalid` | input | `boolean` | `false` | Shows the error and sets `aria-invalid` on the control |
| `required` | input | `boolean` | `false` | Sets `required` or `aria-required` on the control |
| `disabled` | input | `boolean` | `false` | Passed to the control |

No value and no events: those belong to the control and the forms layer.

**Regions:** `label`, `hint`, `error` (marked content, all optional) and the default content, which is
the single control. The wrapper adds no box styling.

**Styling hooks:** the wrapper carries `data-invalid`, `data-required` and `data-disabled`, so a stylesheet
can draw a required marker or tint an error without the logic knowing how.

## Behavior

1. Generates ids for the label, the hint, the error and the control part.
2. Associates the label with the control by the control's `labelling` mode: `for`, `labelledby`, or
   `own` (the control brings its label and the label region is not used).
3. Sets `aria-describedby` on the control part: the error id first when `invalid`, then the hint id when
   a hint exists.
4. Passes `invalid`, `required` and `disabled` to the control part as the matching native or ARIA attribute.
5. Renders the error only while `invalid`. The hint stays visible, so both can show together.

## The control contract: `fieldControl@1`

A control joins a Field by declaring what to wire:

| Param | Meaning |
|---|---|
| `part` | The node that receives the id and the ARIA attributes. Defaults to the control part of the `valueContract`, then to the focus delegate |
| `labelling` | `for` (native input), `labelledby` (select, groups) or `own` (checkbox, toggle) |

A control that does not declare it can still be placed inside a Field, but gets no wiring and the kit warns
in development.

| Control | `part` | `labelling` |
|---|---|---|
| text-input, textarea | the input | `for` |
| select | the trigger | `labelledby` |
| radio-group | the group | `labelledby` |
| checkbox, toggle | the box | `own` |

## Usage

```html
<!-- Angular -->
<lucent-field [invalid]="email.invalid" required>
  <span lucentLabel>Email</span>
  <lucent-text-input formControlName="email" />
  <span lucentHint>We never share it.</span>
  <span lucentError>Enter a valid email address.</span>
</lucent-field>
```

```tsx
// React
<Field invalid={invalid} required>
  <Field.Label>Email</Field.Label>
  <TextInput />
  <Field.Hint>We never share it.</Field.Hint>
  <Field.Error>Enter a valid email address.</Field.Error>
</Field>
```

## Composition

- Field does not list the controls it accepts: any component that declares `fieldControl@1` participates.
  The closed-set rule for `allowedComponents` applies to slots of components in the design system, and
  Field is not one.
- Label, hint and error are not components. Their text takes `.lucent-text-label-md` and
  `.lucent-text-caption` and the semantic color tokens; spacing between the pieces is the consumer's.

## States & accessibility

- A control needs an accessible name. Inside a Field it comes from the label; outside, from `ariaLabel`.
- The error is referenced by `aria-describedby`. Announcing it when it appears is not decided.
- `labelling: own` controls ignore the label region.

## Impact on existing controls

`text-input`, `textarea` and `select` lose their own label, hint and error and gain `ariaLabel`. They keep
their frame, their `ControlValueAccessor` and their own states. The frame is each control's, drawn from the
same frame tokens, so a control looks right on its own in a toolbar or a property row.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| Content model (projection) | Conforms | Reuses the existing `lucent*` markers |
| State vocabulary | Conforms | `invalid`, `required`, `disabled` |
| Tokens only | Conforms | Adds none; draws nothing |
| Accessibility | Open | Error announcement undecided |

## Model needs

- The `fieldControl` pattern in the catalog, with typed `part` and `labelling` params. Pattern params are
  untyped today.
- One declaration of the control part: `valueContract.part`, with the focus delegate and `fieldControl`
  deriving from it.
- No new node types. Hint and error stay visible together, so no negation in `visibleWhen`.

## Out of scope

Validation, Form, spacing and layout of the pieces, floating labels, character count, and a styled
form-field component. A styled host that governs disposition can be added later without changing this
contract.

## Notes / TODO

- Open: whether `lucent-styles` ships default classes for the label, hint and error parts (for example
  `.lucent-field__label`), built from the text utilities. It is CSS only and would not change the logic.
- Wave 1 follow-ups: number field, search field, accordion group.
