# `DfChip` — `<df-chip>`

> A compact label chip with optional leading hash icon or a trailing remove button. Its single
> `type` input currently conflates several concerns — see the conventions check.

**Tier:** Interactive
**Selector:** `df-chip`
**Source:** [`../../chip/chip.ts`](../../chip/chip.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` | Density scale (`xs/sm/md/lg`); stays pill-shaped |
| `type` | input | `ChipType` | `'default'` | Mixes appearance **and** structure (see below) |
| `label` | input | `string` | `''` | Text only — no projection |
| `closed` | output | `void` | — | **Only fires when `type="action"`** |

**Content slots:** none — `label` only.
**Exported types:** `ChipType = 'tag' \| 'default' \| 'active' \| 'action'`

`type` behaviour: `tag` → leading `#` icon · `default`/`active` → appearance only · `action` →
trailing remove button that emits `closed`.

## Usage

```html
<df-chip type="tag" label="design-system" />
<df-chip type="active" label="Selected" />
<df-chip type="action" label="React" (closed)="remove('React')" />
```

## Composition

- Renders an internal `df-icon` for the `tag` hash and the `action` close button.

## States & accessibility

- The `action` close button has an `aria-label` (`Remove <label>`). The rest is presentational.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ❌ | `{{ label() }}` only — no projection ([API-AUDIT §1](../API-AUDIT.md)) |
| §5 adornments | ❌ | Leading icon is hardcoded to `tag`; no `dfLeading`/`icon` ([API-AUDIT §2](../API-AUDIT.md)) |
| **single-axis `type`** | ❌ | Conflates appearance + has-icon + removable; can't have a removable non-`action` chip ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 output naming | ⚠️ | `closed` is past-tense (ok) but only valid for one `type`; proposal renames to `removed` |
| §10 density | ✅ | On the shared `ControlSize` scale |
| §8 tokens | ✅ | |

## Notes / TODO

- Split `type` into orthogonal `variant` + `removable` + leading-icon slot; rename `closed` →
  `removed` and make it valid whenever `removable` ([API-PROPOSAL §Rule 6](../API-PROPOSAL.md)).
- Add projection + `label` shorthand.
