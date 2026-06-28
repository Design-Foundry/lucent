# `DfTag` — `<df-tag>`

> A minimal inline label chip. Pure presentation — projects whatever you put in it.

**Tier:** Primitive
**Selector:** `df-tag`
**Source:** [`../../tag/tag.ts`](../../tag/tag.ts)

## API

No inputs or outputs. The entire content is projected.

**Content slots:** default `<ng-content />` (the tag's content).
**Exported types:** none.

## Usage

```html
<df-tag>v2.4.0</df-tag>
<df-tag><df-icon name="lock" size="xs" /> Private</df-tag>
```

## Composition

- Standalone primitive; composes with anything via projection.
- Distinct from `df-status-tag` (semantic status colour) and `df-chip` (interactive/removable).
  See the "badge vs tag vs chip" gap in [API-AUDIT §6](../API-AUDIT.md).

## States & accessibility

- No interactive state; renders inline. Add your own semantics if a tag is meaningful.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model (projection) | ✅ | Projects directly — but has **no `label` shorthand** for the data-driven case (CONVENTIONS §5 wants both) |
| §4 typed API | n/a | No API |
| §8 tokens | ✅ | |

## Notes / TODO

- Add the optional `label` shorthand for parity with the meta-rule (per
  [API-PROPOSAL §Rule 1](../API-PROPOSAL.md): "`button`/`tag` already project; just add the
  `label` shorthand").
- Clarify the tag / status-tag / chip / (missing) badge boundary as part of scope decisions.
