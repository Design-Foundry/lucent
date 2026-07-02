# Segmented control — `<lucent-segmented-control>`

> A compact inline single-select for switching a **view or mode** among a few peers
> (Day/Week/Month, List/Grid, Chart/Table). The selected segment lifts to a white pill.

**Tier:** Interactive
**Targets:** `LucentSegmentedControl` (Angular · `lucent-segmented-control`) · `SegmentedControl` (React) · `<lucent-segmented-control>` (Web Components) · `LucentSegmentedControl` (Blazor)
**Source:** [`../../packages/angular/src/segmented-control/segmented-control.ts`](../../packages/angular/src/segmented-control/segmented-control.ts) · CSS [`../../styles/components/segmented-control.css`](../../styles/components/segmented-control.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `options` | input | `SegmentedOption<T>[]` | `[]` | Segments: `{ label, value, disabled? }` |
| `value` | model / input | `T` | `null` | Selected value (two-way) |
| `size` | input | `ControlSize` | `'md'` | Density |
| `label` | input | `string` | `''` | Accessible name for the group |

**Exported types:** `SegmentedOption<T> = { label: string; value: T; disabled?: boolean }`

## When to use

- **2–4 mutually-exclusive modes** that fit inline and read at a glance (Day/Week/Month).
- Use **`tab-list`** to switch *content panels* (the boundary: tabs change the view's content;
  a segmented control changes a *mode* while the content stays put).
- Use **`radio`** for a vertical form choice; **`select`** when there are many options.

Keep segments short and few — this is a pill row, not a menu.

## Usage

```html
<!-- Angular -->
<lucent-segmented-control
  [options]="[{label:'Day',value:'d'},{label:'Week',value:'w'},{label:'Month',value:'m'}]"
  [(value)]="range" label="Range" />
```
```tsx
/* React */
<SegmentedControl
  options={[{label:'Day',value:'d'},{label:'Week',value:'w'},{label:'Month',value:'m'}]}
  value={range} onChange={setRange} label="Range" />
```
```razor
@* Blazor *@
<LucentSegmentedControl TValue="string" @bind-Value="range" Label="Range"
  Options="@(new[]{ new SegmentedOption<string>("Day","d"), new SegmentedOption<string>("Week","w") })" />
```

## Composition

- Data-driven (segments are simple labels) — mirrors `select`'s `options` model. Renders a
  `role="group"` of equal-width toggle buttons.
- Renders no sub-components.

## States & accessibility

- Each segment is a `<button>` with `aria-pressed` reflecting the selection; the group has an
  `aria-label`. Buttons are individually focusable (Tab), and Enter/Space activate natively.
- Distinct visual language from `tab-list` (pill vs. underline) so the two roles don't blur.
- `disabled` per segment is honoured.

## Do / Don't

- **Do** keep it to 2–4 short segments; ensure one is always selected.
- **Do** reserve it for *mode* switches, not navigation between pages.
- **Don't** use it as tabs (use `tab-list`) or for long option sets (use `select`).
- **Don't** mix very different-length labels — equal-width segments will look lopsided.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-segmented-control`, `__segment`, `is-selected`) | ✅ | |
| §4 generic value / model | ✅ | `value` typed `T`, two-way |
| §5 data-driven `options` | ✅ | Like `select` (simple labels) |
| §7 a11y (`group` + `aria-pressed`) | ✅ ⚠️ | Toggle-button pattern; arrow-roving is a possible refinement |
| §8 tokens | ✅ | Track `border-default`, selected `surface-default` + `border-subtle` + `shadow-sm` |
| §10 density | ✅ | `xs/sm/md/lg` |

## Notes / TODO

- Could gain projected segments with icons; today segments are label-only for cross-kit parity.
