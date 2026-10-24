# `DfTooltip` — `[dfTooltip]`

> An accessible tooltip **directive**. Apply to any focusable trigger; shows a floating bubble
> on hover and keyboard focus.

**Tier:** Primitive (directive + internal `df-tooltip-bubble` component)
**Selector:** `[dfTooltip]`
**Source:** [`../../tooltip/tooltip.ts`](../../tooltip/tooltip.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `dfTooltip` | `@Input` | `string` | `''` | The tooltip text (empty = no tooltip) |
| `dfTooltipPosition` | `@Input` | `TooltipPosition` | `'top'` | Side to anchor on |

**Exported types:** `TooltipPosition = 'top' \| 'bottom' \| 'left' \| 'right'`

## Usage

```html
<df-button dfTooltip="Save changes" dfTooltipPosition="bottom">Save</df-button>
<df-icon-button icon="info" dfTooltip="More info" ariaLabel="Info" />
```

## Composition

- A directive you attach to existing triggers — not a wrapper element.
- Renders `DfTooltipBubble` into a **CDK overlay** (`flexibleConnectedTo`, reposition scroll
  strategy). Requires the CDK overlay CSS.

## States & accessibility

- Shows on `mouseenter` / `focusin`; hides on `mouseleave` / `focusout` / **Escape**.
- Sets `aria-describedby` on the trigger pointing at the bubble (`role="tooltip"`), so the
  text is announced. Disposes the overlay on destroy.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §4 signal inputs | ❌ | **Only component still on legacy `@Input`** ([API-AUDIT §6](../API-AUDIT.md)); migrate to `input()` |
| §7 a11y | ✅ | `aria-describedby`, focus + Escape handling |
| §8 tokens | ✅ | |

## Notes / TODO

- Migrate `@Input` → `input()` ([API-PROPOSAL §Rule 6](../API-PROPOSAL.md)).
- A generic `popover` (rich content vs. text-only) is a noted gap ([API-AUDIT §6](../API-AUDIT.md)).
