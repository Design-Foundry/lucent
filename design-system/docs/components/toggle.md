# `DfToggle` — `<df-toggle>`

> An on/off switch. A `ControlValueAccessor`, so it binds with `[(ngModel)]` /
> `formControlName`.

**Tier:** Interactive (form control)
**Selector:** `df-toggle`
**Source:** [`../../toggle/toggle.ts`](../../toggle/toggle.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `ToggleSize` | `'md'` | |
| `label` | input | `string` | `''` | Rendered as visible text **and** the `aria-label` |
| value | (CVA) | `boolean` | `false` | Via forms; `checked` signal internally |

**Content slots:** none — `label` only.
**Exported types:** `ToggleSize = 'md' \| 'sm'`

## Usage

```html
<df-toggle [(ngModel)]="notifications" label="Email notifications" />
<df-toggle formControlName="darkMode" size="sm" />
```

## Composition

- Track + thumb; optional trailing `label`. Disabled comes from forms only.

## States & accessibility

- `role="switch"`, `aria-checked`, `tabindex` managed, Space/Enter toggle (`preventDefault`).
- `label` doubles as `aria-label` when set; with no `label`, supply an external one.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §6 disabled | ❌ | **No standalone `[disabled]` input** — only `setDisabledState` via forms ([API-AUDIT §5](../API-AUDIT.md)); `<df-toggle disabled>` does nothing |
| §5 content model | ⚠️ | `label` is text-only — no projection (fine for a switch, but inconsistent with §1) |
| §7 a11y | ✅ | Proper switch semantics |
| §9 forms | ✅ | CVA implemented |
| §8 tokens | ✅ | |

## Notes / TODO

- Add a `disabled` input that shares the `isDisabled` signal with `setDisabledState`
  ([API-PROPOSAL §Rule 5](../API-PROPOSAL.md)).
