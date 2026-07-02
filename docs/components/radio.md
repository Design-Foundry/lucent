# Radio + Radio group — `<lucent-radio>` / `<lucent-radio-group>`

> Single-choice selection from a small, visible set of mutually-exclusive options. Reach for
> it when the user must pick exactly one and seeing all choices at once matters (2–6 options);
> beyond that, a `select` scales better. For independent on/off use `checkbox`; for a compact
> inline mode switch use `segmented-control`.

**Tier:** Interactive (form control)
**Targets:** `LucentRadio` / `LucentRadioGroup` (Angular) · `Radio` / `RadioGroup` (React) · `<lucent-radio>` / `<lucent-radio-group>` (Web Components) · `LucentRadio` / `LucentRadioGroup` (Blazor)
**Source:** [`../../packages/angular/src/radio/radio.ts`](../../packages/angular/src/radio/radio.ts) · CSS [`../../styles/components/radio.css`](../../styles/components/radio.css)

## API

**Radio group** (owns the value + shared density)

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | model / input | `T` | `null` | Selected value (two-way: `[(ngModel)]`, `@bind-Value`, `value`/`onChange`) |
| `size` | input | `ControlSize` | `'md'` | Density applied to every child radio |
| `disabled` | input | `boolean` | `false` | Disables the whole group |
| `label` | input | `string` | `''` | Accessible name for the group (`aria-label`) |

**Radio** (one option)

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input | `T` | — | Identity this radio contributes |
| `label` | input | `string` | `''` | Trailing label |
| `size` | input | `ControlSize` | (group) | Per-radio override |
| `disabled` | input | `boolean` | `false` | Disables just this radio |

**Exported types:** shares `ControlSize`.

## When to use

- **2–6 visible, mutually-exclusive options** where comparison at a glance helps.
- Use **`checkbox`** for independent toggles (any number can be on).
- Use **`select`** when the list is long or space is tight.
- Use **`segmented-control`** for a compact inline view/mode switch (Day/Week/Month).

Density (`size`) follows the shared control scale: `xs`/`sm` in dense panels, `md` default,
`lg` for forms/touch.

## Usage

```html
<!-- Angular -->
<lucent-radio-group [(ngModel)]="plan" label="Plan" size="md">
  <lucent-radio [value]="'free'" label="Free" />
  <lucent-radio [value]="'pro'" label="Pro" />
</lucent-radio-group>
```
```tsx
/* React */
<RadioGroup value={plan} onChange={setPlan} label="Plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
```
```html
<!-- Web Components -->
<lucent-radio-group value="free" label="Plan">
  <lucent-radio value="free" label="Free"></lucent-radio>
  <lucent-radio value="pro" label="Pro"></lucent-radio>
</lucent-radio-group>
```
```razor
@* Blazor *@
<LucentRadioGroup TValue="string" @bind-Value="plan" Label="Plan">
  <LucentRadio TValue="string" Value="free" Label="Free" />
  <LucentRadio TValue="string" Value="pro" Label="Pro" />
</LucentRadioGroup>
```

## Composition

- **Group ↔ radio**: the group owns the value; each radio reads its checked state (its `value`
  equals the group's) and asks the group to select it. Mirrors `select` ↔ `option`.
- The Razor kit backs each radio with a native `<input type="radio">` sharing the group's
  `name`, so selection, keyboard, and form posting work under static SSR with no JS. The
  Angular/React/WC kits drive it with `role="radio"` + `aria-checked` and a shared value.

## States & accessibility

- Group is `role="radiogroup"` with an accessible name; each option is `role="radio"` +
  `aria-checked`.
- The selected radio (or the first, when none is selected) is the single tab stop; Space/Enter
  selects. (Native arrow-key roving is inherent to the Razor native-input path; the JS kits
  select on Space/Enter — full arrow roving is a planned refinement.)
- `disabled` is honoured on the group and per-radio; form integration mirrors `checkbox`
  (Angular CVA on the group; native input in Blazor).

## Do / Don't

- **Do** give the group a label and preselect a sensible default when one exists.
- **Do** keep the option set short and stable.
- **Don't** use radios for independent toggles (use `checkbox`) or for >6 options (use `select`).
- **Don't** leave a radio group with no way to represent "none" if that's a valid answer.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-radio`, `--size`, `is-checked`) | ✅ | |
| §4 generic value | ✅ | `value` typed `T` (group + radio) |
| §6 state vocab / `disabled` | ✅ | Group + per-radio `disabled`; CVA-honoured |
| §7 a11y (`radiogroup`/`radio`, `aria-checked`) | ✅ ⚠️ | Arrow-key roving is a planned refinement in the JS kits |
| §9 forms (CVA on the group) | ✅ | Mirrors `checkbox` |
| §10 density | ✅ | `xs/sm/md/lg` |

## Notes / TODO

- Add full arrow-key roving to the Angular/React/WC group (the native Blazor path already has it).
