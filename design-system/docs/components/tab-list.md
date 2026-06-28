# `DfTabList` — `<df-tab-list>`

> Coordinates a set of projected `df-tab`s: pushes `scale`/selection down and handles keyboard
> navigation. The **projection-collection exemplar** — what `df-list`/`df-nav-rail` should
> emulate.

**Tier:** Container
**Selector:** `df-tab-list`
**Source:** [`../../tab-list/tab-list.ts`](../../tab-list/tab-list.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `scale` | input | `TabScale` | `'md'` | Pushed to every child tab |
| `activeTab` | input | `string` | `''` | The selected tab's `value` |
| `tabChange` | output | `string` | — | Emits the newly selected tab's `value` |

**Content slots:** default — project `df-tab`s.
**Exported types:** none (reuses `TabScale`).

## Usage

```html
<df-tab-list scale="sm" [activeTab]="tab()" (tabChange)="tab.set($event)">
  <df-tab value="a">A</df-tab>
  <df-tab value="b">B</df-tab>
</df-tab-list>
```

> Selection is **not** two-way — bind `activeTab` and handle `tabChange` yourself.

## Composition

- `contentChildren(DfTab)` + an `effect` set each tab's `scale` and `active`
  (`tab.value() === activeTab`). Selection is value-based.
- `role="tablist"`; click + keyboard (Arrow/Home/End, roving focus to enabled tabs) emit
  `tabChange`.

## States & accessibility

- Proper `tablist` keyboard model (skips disabled, wraps, moves focus). Strong reference for a
  managed projected collection.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ✅ | The exemplar — projects + coordinates children |
| §4 two-way state | ⚠️ | `activeTab`/`tabChange` instead of a `model()` `[(value)]` ([API-PROPOSAL §Rule 5](../API-PROPOSAL.md)) |
| §4 output naming | ⚠️ | `tabChange` ok for value-change, but align with the `[(value)]` convention |
| §7 a11y | ✅ | Full roving-tabindex keyboard nav |
| §8 tokens | ✅ | |

## Notes / TODO

- Offer two-way `[(value)]` (model) in addition to `activeTab`/`tabChange`.
- Wire `aria-controls` to tab panels once a `df-tab-panel` exists.
