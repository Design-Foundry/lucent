<!-- Copy this file to <component>.md. Keep sections in this order; delete a section only if
     it genuinely doesn't apply (e.g. "Forms" for a non-control), and say so. -->

# `DfThing` — `<df-thing>`

> One sentence: what it is and when to reach for it.

**Tier:** Primitive · Interactive · Navigation · Form input · Data display · Container · Overlay
**Selector:** `df-thing` (or `[dfThing]` for directives)
**Source:** [`../../thing/thing.ts`](../../thing/thing.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `label` | input | `string` | `''` | Shorthand; projected content overrides |
| … | | | | |

**Content slots:** default = primary · `[dfLeading]` · `[dfSupporting]` · `[dfTrailing]` (list only what applies)

**Exported types:** `ThingVariant`, …

## Usage

```html
<!-- shorthand -->
<df-thing icon="x" label="Simple" />

<!-- rich / projected -->
<df-thing [value]="id" (activated)="open($event)">
  <df-icon dfLeading name="x" />
  Rich content
  <span dfSupporting>Second line</span>
</df-thing>
```

## Composition

- What it composes with / into (e.g. "projects into `df-list`", "specializes `df-list-item`").
- What it renders internally (e.g. "renders a `df-icon` for the `icon` shorthand").

## States & accessibility

- Roles, `aria-*`, keyboard, focus behaviour. What's owned here vs. by a parent/usage site.

## Conventions check

How this component measures against [CONVENTIONS.md](../CONVENTIONS.md). **This is the
inconsistency log** — be honest; link the audit item where one exists.

| Rule | Status | Note |
|---|---|---|
| §5 content model (projection + `label`) | ✅ / ⚠️ / ❌ | |
| §5 adornments (`dfLeading`/`dfTrailing`, `icon`) | | |
| §6 state vocab (`selected`/`active`/`disabled`) | | |
| §4 output naming / generic value | | |
| §7 a11y | | |
| §8 tokens (no `surface-subtle`, etc.) | | |

## Notes / TODO

- Known gaps, planned changes, links to [API-AUDIT.md](../API-AUDIT.md) / [API-PROPOSAL.md](../API-PROPOSAL.md).
