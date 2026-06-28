# `DfListItem<T>` — `<df-list-item>`

> An interactive, content-rich list row — and the kit's **reference primitive**. It is the
> worked example of every API convention; other row components (`df-option`, `df-menu-item`)
> are meant to specialize from it.

**Tier:** Data display
**Selector:** `df-list-item`
**Source:** [`../../list-item/list-item.ts`](../../list-item/list-item.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | input | `T \| undefined` | `undefined` | Typed identity; carried by `activated` |
| `label` | input | `string` | `''` | Primary-text shorthand; projected content overrides |
| `icon` | input | `string` | `''` | Leading-icon shorthand; `[dfLeading]` overrides |
| `selected` | input | `boolean` | `false` | Chosen state (the `aria-selected` sense) |
| `disabled` | input | `boolean` | `false` | Non-interactive; dimmed |
| `interactive` | input | `boolean` | `true` | Adds `role="button"` + keyboard activation |
| `tone` | input | `Tone` | `'default'` | `'danger'` marks a destructive row (red text/icon, hover intensifies) |
| `activated` | output | `T \| undefined` | — | Fires on click / Enter / Space |

**Content slots:** default = primary text · `[dfLeading]` (icon/avatar) · `[dfSupporting]`
(second line) · `[dfTrailing]` (meta / actions / chevron)

**Exported types:** none (generic class `DfListItem<T>`).

## Usage

```html
<!-- shorthand: terse, data-driven -->
<df-list-item icon="folder" label="Components" />

<!-- rich: projected content, two-line, trailing actions -->
<df-list-item [value]="m.id" [selected]="m.id === activeId" (activated)="open($event)">
  <df-avatar dfLeading [name]="m.name" />
  {{ m.name }}
  <span dfSupporting>{{ m.email }}</span>
  <df-icon-button dfTrailing icon="more_vert" ariaLabel="Actions" />
</df-list-item>

<!-- destructive row -->
<df-list-item icon="delete" label="Delete project" tone="danger" (activated)="remove()" />

<!-- static (non-interactive) display row -->
<df-list-item [interactive]="false" label="Read-only row" />
```

Compose inside `df-list`:

```html
<df-list>
  @for (item of items(); track item.id) {
    <df-list-item [value]="item.id" [label]="item.name" (activated)="select($event)" />
  }
</df-list>
```

## Composition

- **Projects into** `df-list` (a thin `<ng-content />` container).
- **Renders internally** a `df-icon` for the `icon` shorthand — only when no `[dfLeading]` is
  projected (projection wins).
- **Is the base for** `df-option` (adds `role="option"` + `aria-selected` listbox semantics)
  and `df-menu-item` (adds `role="menuitem"` + `variant`). _Folding those in is pending — see
  [API-PROPOSAL §Rule 4](../API-PROPOSAL.md)._
- Slot presence is detected with `contentChild(DfLeading)` / `contentChild(DfSupporting)` to
  gate the icon fallback and the supporting line.

## States & accessibility

- **Interactive (default):** host gets `role="button"`, `tabindex="0"` (or none when
  disabled), and Enter/Space activation (Space `preventDefault`ed). `:focus-visible` outline
  uses `--color--semantic--border-focus`.
- **Non-interactive (`[interactive]="false"`):** no role/tabindex/keyboard — a plain row.
- **Disabled:** `aria-disabled`, `pointer-events: none`, dimmed; activation is suppressed.
- **Selected:** rendered visually only. Semantic `aria-selected` is intentionally **not** set
  here — that belongs to listbox/tab specializations. For a single-select nav list, set
  `aria-current` at the usage site.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model (projection + `label`) | ✅ | `<ng-content>{{ label() }}</ng-content>` |
| §5 adornments (`dfLeading`/`dfTrailing`, `icon`) | ✅ | Reference implementation of the new slots |
| §5 secondary text (`dfSupporting`) | ✅ | Two-line rows |
| §6 state vocab (`selected`/`disabled`/`interactive`) | ✅ | Renamed from the old `active` |
| §6 tone (action intent) | ✅ | `tone="danger"` — the reference for destructive rows |
| §4 output naming / generic value | ✅ | `activated`, `DfListItem<T>` |
| §7 a11y | ✅ | role/tabindex/keyboard/focus-visible when interactive |
| §8 tokens | ✅ | Uses `df-option`'s working hover/selected; no `surface-subtle` |

This is the only row component currently fully on-convention; `df-option` and `df-menu-item`
still diverge (see their pages and [API-AUDIT §4](../API-AUDIT.md)).

## Notes / TODO

- Fold `df-option` and `df-menu-item` onto this primitive ([API-PROPOSAL §Rule 4](../API-PROPOSAL.md)).
- Selection ARIA for a plain selectable `df-list` (vs. listbox) is left to the usage site;
  revisit if a first-class single-select list is wanted.
