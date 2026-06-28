# `DfInput` — `<df-input>`

> The text field. The kit's **`ControlValueAccessor` reference** and the source of the
> `dfLabel`/`dfHint`/`dfError` form-field pattern.

**Tier:** Form input
**Selector:** `df-input`
**Source:** [`../../input/input.ts`](../../input/input.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` | Density scale (`xs/sm/md/lg`) |
| `placeholder` | input | `string` | `''` | |
| `type` | input | `string` | `'text'` | Forwarded to the native `<input>` |
| `readonly` | input | `boolean` | `false` | |
| `clearable` | input | `boolean` | `false` | Shows a clear `df-icon-button` once filled |
| `cleared` | output | `void` | — | Emitted when the clear button is used |
| value | (CVA) | `string` | `''` | Via `[(ngModel)]` / `formControlName` |

**Content slots:** `[dfLabel]` · `[dfHint]` · `[dfError]` (presence of `dfError` drives the
error state) · `[dfPrefix]` · `[dfSuffix]`.
**Exported types:** none.

## Usage

```html
<df-input [(ngModel)]="email" type="email" placeholder="you@example.com" clearable (cleared)="onClear()">
  <span dfLabel>Email</span>
  <df-icon dfPrefix name="mail" />
  <span dfHint>We never share it</span>
</df-input>

<df-input formControlName="name">
  <span dfLabel>Name</span>
  <span dfError>Required</span>
</df-input>
```

## Composition

- Wraps a native `<input>`; renders an internal `df-icon-button` for `clearable`.
- The `dfLabel`/`dfHint`/`dfError` trio is detected via `contentChild` and is the pattern a
  future `df-form-field` should extract (it's duplicated in `df-select`).

## States & accessibility

- `<label for>` wiring, `aria-invalid` on error, `aria-describedby` → hint/error message id.
  Focus/filled/error/readonly/disabled states drive `wrapperClass`.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §10 density | ✅ | On the shared `ControlSize` scale |
| §9 forms (CVA) | ✅ | Reference implementation |
| §5 field-region slots | ✅ | `dfLabel`/`dfHint`/`dfError` are the correct "distinct region" use |
| §5 adornments | ⚠️ | Uses `dfPrefix`/`dfSuffix`; should become `dfLeading`/`dfTrailing` ([API-AUDIT §2](../API-AUDIT.md)) |
| §6 disabled | ⚠️ | Forms-only (no standalone `[disabled]` input) |
| §4 output naming | ✅ | `cleared` (past-tense) |
| §7 a11y | ✅ | label/aria-invalid/describedby |
| §8 tokens | ✅ | |

## Notes / TODO

- Migrate adornment slots to `dfLeading`/`dfTrailing`; add a standalone `disabled` input.
- Extract the field-region trio into a shared `df-form-field` ([API-PROPOSAL §Rule 6](../API-PROPOSAL.md)).
