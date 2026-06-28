# `DfSelect` — `<df-select>`

> A single-select dropdown (combobox + listbox) driven by an `options` array. A
> `ControlValueAccessor` with full keyboard support. Its data model is the kit's most-cited
> consistency problem.

**Tier:** Form input
**Selector:** `df-select`
**Source:** [`../../select/select.ts`](../../select/select.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` | Density scale (`xs/sm/md/lg`) |
| `placeholder` | input | `string` | `'Select an option'` | |
| `options` | input | `SelectOption[]` | `[]` | Rendered internally as `df-option`s |
| `selectionChange` | output | `unknown` | — | Emits the chosen value (also flows via CVA) |
| value | (CVA) | `unknown` | `null` | Via `[(ngModel)]` / `formControlName` |

```ts
interface SelectOption { label: string; value: unknown; }   // ⚠️ weaker than df-option
```

**Content slots:** `[dfLabel]` · `[dfHint]` · `[dfError]` (same field-region trio as `df-input`).
**Exported types:** `SelectOption`

## Usage

```html
<df-select [(ngModel)]="role" [options]="roles">
  <span dfLabel>Role</span>
</df-select>
```
```ts
roles: SelectOption[] = [{ label: 'Admin', value: 'admin' }, { label: 'Member', value: 'member' }];
```

## Composition

- Renders the listbox in a **CDK overlay** anchored to the trigger; renders each option as a
  `df-option` from the `options` array.
- **Does not accept projected `<df-option>`** — the §3 collision. So no disabled options, no
  per-option icon/description, no groups, no custom content, despite `df-option` supporting
  several of those.

## States & accessibility

- Strong: trigger is `role="combobox"` with `aria-haspopup/expanded/controls/activedescendant`,
  listbox `role="listbox"`, full keyboard (Arrows/Home/End/Enter/Space/Escape/Tab), focus
  return to trigger on select. `aria-invalid`/`aria-describedby` for errors.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ❌ | Array-only; not projection-composable with `df-option` ([API-AUDIT §3](../API-AUDIT.md)) |
| §5 item capability | ❌ | `SelectOption` strictly weaker than `df-option` (no `disabled`/icon) |
| §4 typed value | ❌ | `options`/value/`selectionChange` all `unknown` — should be `DfSelect<T>` |
| §6 disabled | ⚠️ | Field disabled is forms-only |
| §4 output naming | ⚠️ | `selectionChange` → prefer CVA/`[(ngModel)]`; rename if a non-form event is kept |
| §10 density | ✅ | Trigger on the shared `ControlSize` scale (dropdown options not yet sized) |
| §7 a11y | ✅ | Exemplary combobox/listbox semantics |
| §8 tokens | ✅ | |

## Notes / TODO

- Accept projected `df-option`s **or** widen `SelectOption<T>` to `{ value; label?; disabled?; icon?; … }`
  and make the component generic ([API-PROPOSAL §Rule 3 & §Rule 6](../API-PROPOSAL.md)).
- Multi-select, type-ahead, option groups are noted gaps ([API-AUDIT §6](../API-AUDIT.md)).
