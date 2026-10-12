# Search field: `<lucent-search-field>`

> A text field for searching: a search icon, a clear button, Escape to clear and Enter to submit. It reports what was typed and leaves the querying to the consumer.

**Tier:** Form input (the `forms` group)
**Selector:** Angular `lucent-search-field`, React `<SearchField>`
**Status:** defined, not implemented

## What it is

Mostly a `text-input` with search defaults and two keys. It is a component of its own and not a variant of
`text-input` because Escape and Enter are behavior, and behavior is declared per component, not per variant.

| | text-input | search-field |
|---|---|---|
| Input type | `text` | `search`: announced as a search box, and mobile keyboards show the search key |
| Leading icon | optional | always the search icon |
| Clear button | opt-in (`clearable`) | whenever there is text |
| Escape | nothing | clears the text |
| Enter | nothing | emits `submit` |
| Events | `valueChange` | also `submit` and `clear` |
| Loading | no | optional, swaps the icon for a spinner |

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input and output | `string` | `''` | Paired with `valueChange` |
| `placeholder` | input | `string` | `Search` | |
| `loading` | input | `boolean` | `false` | Shows a spinner in place of the icon and sets `aria-busy` |
| `disabled`, `readonly` | input | `boolean` | `false` | Reflect states of the same name |
| `ariaLabel` | input | `string` | `Search` | The accessible name outside a Field |
| `size` | axis | `ControlSize` | `md` | `xs`, `sm`, `md`, `lg`, bound to the control sizes |
| `valueChange` | output | `string` | none | Emitted on every change of the text |
| `submit` | output | `string` | none | Emitted on Enter, with the current text |
| `clear` | output | `void` | none | Emitted when the text is cleared by the button or by Escape |

No slots in the first version.

**States:** `hover`, `focus-visible`, `disabled`, `readonly`, `loading`, `filled` (there is text) and `invalid`
(reflects `aria-invalid`, set by a Field).

## Structure (aspirational FDL)

```fdl
component search-field "Search field" {
  axis size = xs | sm | md* | lg binds @control

  prop value: string = ""
  prop placeholder: string = "Search"
  prop loading: boolean = false reflects loading
  prop disabled: boolean = false reflects disabled
  prop readonly: boolean = false reflects readonly
  prop ariaLabel: string = "Search"
  event valueChange: string
  event submit: string
  event clear
  twoWay value <-> valueChange

  state filled: logical
  state loading: logical

  part root: surface row align center {
    part search-icon: icon "search" show-when idle
    part spinner: icon "progress" show-when loading
    part input: surface inputType search {
      on-key-down key "Escape" if filled = true -> setValue value ""
      on-key-down key "Enter" -> emit submit
    }
    part clear: component icon-button(icon: "close", ariaLabel: "Clear") show-when filled {
      on pressed -> setValue value ""
    }
  }

  valueContract { value: value, change: valueChange, part: input }
  behavior {
    fieldControl@1 part: input, labelling: for
    ariaBindings aria-busy <- loading
  }
}
```

No new pattern: the behavior is plain interactions plus `setValue`. The icon and the spinner swap on `loading`.

## Behavior

- **Escape** clears the text when there is some, emits `clear` and keeps the focus in the input. With the field
  empty it does nothing and is not consumed, so an enclosing dialog or popover can still close on it.
- **Enter** emits `submit` with the current text. It does not change the value.
- **Clear button** empties the text, emits `clear` and returns the focus to the input.
- The native clear control of `type="search"` is hidden so there is only one.
- The input sets `enterkeyhint="search"` and `autocomplete="off"`.
- `readonly` blocks clearing. `disabled` is not focusable.

## Usage

```html
<!-- Angular -->
<lucent-search-field [(value)]="query" [loading]="searching()" (submit)="run($event)" />
```

```tsx
// React
<SearchField value={query} onValueChange={setQuery} loading={searching} onSubmit={run} />
```

## Composition

- Declares `fieldControl@1` with the input as the part and `labelling: for`, so it can sit in a
  [Field](./field.md). Without one, `ariaLabel` names it.
- The frame uses the same frame tokens as `text-input` and `number-field`.
- The clear button is an instance of `icon-button`, as in `text-input`.
- The landmark `role="search"` belongs to the form or region that holds the field, not to the control.

## States & accessibility

- The input is a search box by its type; the placeholder is not a name.
- The clear button has an accessible name and stays in the tab order, as it does in `text-input`.
- `loading` is exposed through `aria-busy`.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| `ControlSize` density axis | Conforms | `size` binds the control sizes |
| State vocabulary | Conforms | `disabled`, `readonly`, `invalid` |
| Output naming | Conforms | `valueChange`; `submit` and `clear` are new |
| Tokens only | Conforms | Reuses the control frame tokens |
| Default strings | Open | `Search` and `Clear` are English, like the rest of the kit |

## Model needs

- `setValue` action (0.8 proposal, change 3). This is the forcing component for it.
- `eventBindings` on component nodes (0.8 proposal, change 4), for `on pressed` on the clear button.
- A state derived from the value (`filled`), also needed by `text-input` and `number-field`.
- A way to show something when a state is not set (the icon while not loading): negation in `visibleWhen`, or an
  enum axis such as `status = idle | loading` used through cell conditions.
- Returning the focus to the input after clearing: an action or a pattern for focus. Not available today.

## Out of scope

Debounce (when to query is the consumer's decision), suggestions and autocomplete (they arrive with the
Combobox and the `combobox@1` pattern, and this field is designed so its input can become that input),
recent searches, scoped search with filters, an expandable search that collapses to an icon, and voice input.

## Notes / TODO

- Next in wave 1: the accordion group.
