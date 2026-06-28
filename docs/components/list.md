# `DfList` — `<df-list>`

> The list container for `df-list-item`s. Layout only — projects its children.

**Tier:** Data display
**Selector:** `df-list`
**Source:** [`../../list/list.ts`](../../list/list.ts)

## API

No inputs/outputs. `template: '<ng-content />'`; styling in `list.scss`.

**Content slots:** default — project `df-list-item`s.
**Exported types:** none.

## Usage

```html
<df-list>
  @for (item of items(); track item.id) {
    <df-list-item [value]="item.id" [label]="item.name" (activated)="open($event)" />
  }
</df-list>
```

## Composition

- Projection container for [`df-list-item`](./list-item.md) (CONVENTIONS §5).
- Provides no selection coordination or keyboard roving (unlike `df-tab-list`). A selectable
  list is currently the consumer's responsibility.

## States & accessibility

- No `role` on the container. Depending on intent it should be `role="list"`,
  `role="listbox"`, or `role="menu"` — and pair with the matching item roles. Today it's a
  plain `<div>`-equivalent, so a `df-list` of items isn't keyboard-navigable as a unit.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ✅ | Projection container |
| §6/§7 selection + a11y | ⚠️ | No roving keyboard / selection model ([API-AUDIT §4](../API-AUDIT.md)) |
| §8 tokens | ✅ | |

## Notes / TODO

- Add an optional managed mode (roving tabindex + `[(value)]`) mirroring `df-tab-list`, with a
  configurable `role`.
