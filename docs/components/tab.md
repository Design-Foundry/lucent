# `DfTab` — `<df-tab>`

> A single tab. The **content-model exemplar**: it already does projection-with-`label`-fallback
> (`<ng-content>{{ label() }}</ng-content>`). Usually coordinated by `df-tab-list`.

**Tier:** Container
**Selector:** `df-tab`
**Source:** [`../../tab/tab.ts`](../../tab/tab.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `label` | input | `string` | `''` | Shorthand — projected content overrides it |
| `icon` | input | `string` | `''` | Leading icon (correct `icon` name) |
| `disabled` | input | `boolean` | `false` | |
| `value` | input | `string` | `''` | Identity used by `df-tab-list` |
| `scale` | **model** | `TabScale` | `'md'` | Two-way; usually set by the list |
| `active` | **model** | `boolean` | `false` | Two-way; "chosen" (should be `selected`) |
| `tabClick` | output | `void` | — | Emitted on click when enabled |

**Content slots:** default = label (with `label` fallback).
**Exported types:** `TabScale = 'lg' \| 'md' \| 'sm' \| 'xs'`

## Usage

```html
<df-tab-list [activeTab]="tab()" (tabChange)="tab.set($event)">
  <df-tab value="overview" icon="dashboard">Overview</df-tab>
  <df-tab value="settings">Settings</df-tab>
</df-tab-list>
```

## Composition

- Designed to be projected into [`df-tab-list`](./tab-list.md), which sets `scale`/`active` via
  an `effect` and emits selection. Can also be driven directly through its two-way models.

## States & accessibility

- `role="tab"`, `aria-selected`, roving `tabindex` (0 when active else -1). Keyboard nav lives
  in the list. No `tab-panel` association (`aria-controls`) yet ([API-AUDIT §6](../API-AUDIT.md)).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ✅ | The reference hybrid (projection + `label`) |
| §5 adornment shorthand | ✅ | `icon` (correct name) |
| §6 state vocab | ❌ | `active` means "chosen" — should be `selected` ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 output naming | ❌ | `tabClick` → `activated` ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 typed value | ⚠️ | `value: string` (not generic) |
| §7 a11y | ⚠️ | Good tab semantics; missing panel wiring |
| §8 tokens | ✅ | |

## Notes / TODO

- Rename `active` → `selected`, `tabClick` → `activated`; add `tab-panel` + `aria-controls`
  ([API-PROPOSAL §Rule 5 & §Rule 6](../API-PROPOSAL.md)).
