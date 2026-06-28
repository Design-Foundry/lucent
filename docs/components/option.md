# `DfOption` — `<df-option>`

> A single listbox option row. Implements `selected` / `active` / `disabled` + a typed-ish
> `value`. **Currently only used internally by `df-select` (rendered from its array) — it
> cannot be projected into a select.**

**Tier:** Form input
**Selector:** `df-option`
**Source:** [`../../option/option.ts`](../../option/option.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `label` | input | `string` | `''` | Text only — no projection |
| `value` | input | `unknown` | `''` | Identity (not generic) |
| `selected` | input | `boolean` | `false` | Chosen (`aria-selected`) |
| `active` | input | `boolean` | `false` | Keyboard highlight (`aria-activedescendant`) — correct vocab |
| `disabled` | input | `boolean` | `false` | Supported here, but **`SelectOption` can't express it** |
| `optionSelect` | output | `unknown` | — | Emitted on click |

**Content slots:** none — `label` only.
**Exported types:** none (uses `SelectOption` from `df-select`).

## Usage

```html
<!-- today: rendered by df-select internally; not consumer-projectable -->
<df-option label="Admin" [value]="'admin'" [selected]="true" />
```

## Composition

- The **canonical example of the §3 collision:** `df-select` renders `df-option` from its
  `options` array but does **not** accept projected `<df-option>`. So `disabled`/custom content
  defined here are unreachable through `df-select`.
- Should become a thin specialization of `df-list-item` ([API-PROPOSAL §Rule 4](../API-PROPOSAL.md)).

## States & accessibility

- `role="option"`, `aria-selected`, `aria-disabled`. Click suppressed when disabled. Correctly
  distinguishes `selected` (chosen) from `active` (keyboard highlight) — the vocab other
  components get wrong.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §6 state vocab | ✅ | `selected` vs `active` correct (the reference for §6) |
| §5 content model | ❌ | `{{ label() }}` only — no projection; no icon/supporting |
| §5 collection composability | ❌ | Not projectable into `df-select` ([API-AUDIT §3](../API-AUDIT.md)) |
| §4 typed value | ❌ | `value: unknown`; `optionSelect` emits `unknown` |
| §4 output naming | ⚠️ | `optionSelect` → proposed `activated` |
| §8 tokens | ✅ | Working hover/selected (the pattern others should copy) |

## Notes / TODO

- Make `df-select` accept projected `df-option`s; make `DfOption<T>` generic; add
  projection/`dfLeading`; rename `optionSelect` → `activated`; fold onto `df-list-item`.
