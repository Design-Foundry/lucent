# `DfMenuItem` — `<df-menu-item>`

> A row inside a `df-menu`. Today a separate near-duplicate of `df-list-item` / `df-option` —
> slated to become a thin specialization of the row primitive.

**Tier:** Container
**Selector:** `df-menu-item`
**Source:** [`../../menu-item/menu-item.ts`](../../menu-item/menu-item.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `label` | input | `string` | `''` | Text only — no projection |
| `icon` | input | `string` | `''` | Leading icon (correct `icon` name) |
| `active` | input | `boolean` | `false` | Highlight state |
| `variant` | input | `MenuItemVariant` | `'default'` | `danger` for destructive actions |

**Content slots:** none — `label` only.
**Exported types:** `MenuItemVariant = 'default' \| 'danger'`

## Usage

```html
<df-menu>
  <df-menu-item icon="edit" label="Rename" />
  <df-menu-item icon="delete" variant="danger" label="Delete" />
</df-menu>
```

## Composition

- One of the three "interactive row" components (`df-list-item`/`df-option`/`df-menu-item`)
  with divergent APIs ([API-AUDIT §4](../API-AUDIT.md)). Should fold onto `df-list-item`.
- No activation `output` — relies on the host `(click)` and the trigger closing the menu.

## States & accessibility

- `role="menuitem"`, `tabindex="0"`, Enter/Space → click. No `disabled`. No arrow-key roving
  (that would live on `df-menu`).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ❌ | `{{ label() }}` only — no projection |
| §5 adornment shorthand | ✅ | `icon` (correct name) |
| §6 state vocab | ⚠️ | `active` (highlight) — ok, but no `selected`/`disabled` |
| §8 tokens | ❌ | **Hover uses the dead `--color--semantic--surface-subtle`** ([API-AUDIT §5](../API-AUDIT.md)) — hover does nothing |
| §4 output | ⚠️ | No `activated` output; host-click only |

## Notes / TODO

- Fix the dead hover (use `df-option`/`df-list-item`'s `surface-base` pattern).
- Fold onto `df-list-item` ([API-PROPOSAL §Rule 4](../API-PROPOSAL.md)); add `disabled` +
  `activated`.
