# `DfCheckbox` — `<df-checkbox>`

> A tri-state checkbox (checked / unchecked / indeterminate). A `ControlValueAccessor` for
> `[(ngModel)]` / `formControlName`.

**Tier:** Interactive (form control)
**Selector:** `df-checkbox`
**Source:** [`../../checkbox/checkbox.ts`](../../checkbox/checkbox.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` | Density scale; scales the box, glyph, and label |
| `label` | input | `string` | `''` | Visible text **and** `aria-label` when set |
| `indeterminate` | input | `boolean` | `false` | Renders the `remove` glyph; `aria-checked="mixed"` |
| value | (CVA) | `boolean` | `false` | Via forms; `checked` signal internally |

**Content slots:** none — `label` only.
**Exported types:** none.

## Usage

```html
<df-checkbox [(ngModel)]="agree" label="I agree" />
<df-checkbox formControlName="all" [indeterminate]="someSelected()" />
```

## Composition

- Box + check/indeterminate `df-icon`; optional trailing `label`.

## States & accessibility

- `role="checkbox"`, `aria-checked` (`true`/`false`/`mixed`), managed `tabindex`, Space toggles
  (`preventDefault`), focus tracked via `is-focused`.
- `label` doubles as `aria-label`; supply an external label if omitted.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §10 density | ✅ | On the shared `ControlSize` scale (box/glyph/label scale together) |
| §6 disabled | ❌ | **No standalone `[disabled]` input** — forms only ([API-AUDIT §5](../API-AUDIT.md)) |
| §5 content model | ⚠️ | `label` text-only, no projection |
| §7 a11y | ✅ | Full checkbox semantics incl. `mixed` |
| §9 forms | ✅ | CVA implemented |
| §8 tokens | ✅ | |

## Notes / TODO

- Add `disabled` input sharing the `isDisabled` signal with `setDisabledState`.
- A `radio` + `radio-group` is a noted gap ([API-AUDIT §6](../API-AUDIT.md)).
