# Text utilities: `.lucent-text-*`

> Classes that apply one typography role to any element. Use them for content you write; components style their own text from the same tokens.

**Tier:** Utility (a new category, see Conventions check)
**Selector:** class `.lucent-text-<role>`, with `.lucent-text-<role>-mono` for the monospace family
**Source:** proposed `styles/utilities/text.css`, imported by `core.css`
**Status:** defined, not implemented

## API

One class per typography token. Each class sets exactly the four properties its role token defines
(`font-family`, `font-size`, `font-weight`, `line-height`) from `--typography--<role>--*` in
[`tokens/typography.css`](../../styles/tokens/typography.css). The values live in the tokens; this page
does not repeat them (see [FOUNDATIONS-TYPOGRAPHY.md](../FOUNDATIONS-TYPOGRAPHY.md)).

| Role | Classes | Intended use |
|---|---|---|
| `display` | `.lucent-text-display` | Marketing only |
| `title-lg`, `title-md`, `title-sm` | `.lucent-text-title-lg` ... | Marketing, hero, large empty states |
| `heading-lg`, `heading-md`, `heading-sm` | `.lucent-text-heading-lg` ... | Page titles, section headings, card headings |
| `body-lg`, `body-md`, `body-sm` | `.lucent-text-body-lg` ... | Leads, reading body, dense reading body |
| `label-lg`, `label-md`, `label-sm` | `.lucent-text-label-lg` ... | Control text, field labels, toolbar and meta labels |
| `caption` | `.lucent-text-caption` | Helper and hint text |
| `micro` | `.lucent-text-micro` | Smallest meta text |

15 roles, each with a `-mono` twin (`.lucent-text-heading-lg-mono`): 30 classes. The mono twins are
separate classes because their weight differs from the sans role in some cases.

## Usage

```html
<h2 class="lucent-text-heading-md">Tokens</h2>
<p class="lucent-text-body-md">Reading text.</p>
<code class="lucent-text-label-md-mono">--spacing-3</code>
```

The author picks the element. Heading level and look are independent: an `h3` can carry
`lucent-text-heading-lg`.

## Composition

- Applies to any element, inherits color, and sets no color, margin, padding or truncation.
- One role class per element. Two role classes on the same element are not supported.
- Components do not use these classes. They bind the typography tokens directly, so utilities and
  components have no dependency in either direction. The utilities are for content the consumer writes.

## Platform expression

| Platform | Expression |
|---|---|
| Web (HTML, Angular, React, Vue, Web Components, Razor) | The classes above |
| Kit shorthand | None for now. A directive or prop that only emits the class can be added later |
| Flutter | A `ThemeExtension` with one `TextStyle` per role, generated from the tokens. Headings carry `Semantics(header: true)` |
| SwiftUI | A modifier such as `.lucentText(.headingLg)`, with the header trait on headings |
| Compose | A `LucentTypography` with one `TextStyle` per role, and `semantics { heading() }` on headings |

The shared contract across platforms is the role vocabulary and the typography tokens. Native
platforms read the tokens (DTCG composite typography) and generate their own styles.

## States & accessibility

- No states and no ARIA. Semantics belong to the element: use a real heading element, not a styled `div`.
- `display` and `title-*` are marketing sizes, not app chrome. `label-sm` and `micro` are 11 and 10 px:
  keep them for secondary text and check contrast.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| `lucent-` prefix | Conforms | |
| Class named after the component type | Not applicable | Utilities are not components. CONVENTIONS.md needs a utilities section (naming, flat names, no state) |
| Tokens only | Conforms | Reads existing `--typography--*` custom properties, adds none |
| Accessibility | Not applicable | Left to the element |

## Out of scope

Text color, truncation and line clamp, visually-hidden, properties beyond the four the role tokens
define, and per-kit wrappers.

## Notes / TODO

- Hand-written like the rest of `styles/`. Generating the classes from the design system's typography
  tokens is possible later; the names match the token names, so nothing would be renamed.
- Add a utilities section to CONVENTIONS.md. Layout utilities follow the same shape and are the next step.
