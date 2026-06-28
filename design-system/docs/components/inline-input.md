# `DfInlineInput` — `<df-inline-input>`

> A borderless, edit-in-place text field that inherits a typography style — for inline rename /
> editable titles. A `ControlValueAccessor`.

**Tier:** Form input
**Selector:** `df-inline-input`
**Source:** [`../../inline-input/inline-input.ts`](../../inline-input/inline-input.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `typography` | input | `string` | `''` | A typography utility class applied to the `<input>` |
| `placeholder` | input | `string` | `''` | |
| value | (CVA) | `string` | `''` | Via forms |

**Content slots:** none.
**Exported types:** none.

## Usage

```html
<df-inline-input [(ngModel)]="title" typography="typography-heading-md" placeholder="Untitled" />
```

## Composition

- A bare `<input>` styled to blend into surrounding text; no label/hint/error (unlike
  `df-input`). `hostClass` merges the typography class with focus/disabled state.

## States & accessibility

- Focus/disabled tracked. **No label association** — pair with a visible label or `aria-label`
  at the usage site.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §9 forms (CVA) | ✅ | |
| §6 disabled | ⚠️ | Forms-only (no standalone `[disabled]`) |
| §7 a11y | ⚠️ | No built-in labelling |
| §8 tokens | ✅ | Typography via utility class |

## Notes / TODO

- `typography` takes a raw class string — consider a typed token enum.
- Add a standalone `disabled` input; document the labelling expectation.
