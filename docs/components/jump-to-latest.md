# Jump to latest — `<lucent-jump-to-latest>`

> A floating pill that appears when the message list is scrolled up — click to snap back to the
> newest message. Shows a count of messages that arrived while you were reading up-thread.

**Tier:** Messaging
**Targets:** `LucentJumpToLatest` (Angular · `lucent-jump-to-latest`) · `JumpToLatest` (React) · `<lucent-jump-to-latest>` (Web Components) · `LucentJumpToLatest` (Blazor)
**Source:** [`../../packages/angular/src/jump-to-latest/jump-to-latest.ts`](../../packages/angular/src/jump-to-latest/jump-to-latest.ts) · CSS [`../../styles/components/jump-to-latest.css`](../../styles/components/jump-to-latest.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `count` | input | `number` | `0` | Shows "N new" when > 0 |
| `label` | input | `string` | `'Jump to latest'` | Accessible name (count appended) |
| `clicked` / `onClick` | output | — | — | Scroll to newest |

## When to use

- In a scrollable message list, show it (usually bottom-centre, floating) **only when the user
  has scrolled away from the bottom**; hide it at the bottom.
- Surface `count` when new messages arrived above the fold so the user knows there's something new.

## Usage

```html
<lucent-jump-to-latest [count]="3" (clicked)="scrollToBottom()" />   <!-- Angular -->
```
```tsx
<JumpToLatest count={3} onClick={scrollToBottom} />                   {/* React */}
```
```razor
<LucentJumpToLatest Count="3" OnClick="ScrollToBottom" />             @* Blazor *@
```

## Composition

- A pill: an optional "N new" count + a down-arrow `icon`. Lives over the message list; the
  usage site owns the show/hide-on-scroll logic and the scroll action.

## States & accessibility

- A button (React/Blazor) / `role="button"` host (Angular/WC) with Enter/Space and a focus ring.
- The accessible name folds in the count ("Jump to latest, 3 new").
- Manage visibility (and focus order) from the scroll container — don't leave it up at the bottom.

## Do / Don't

- **Do** show it only when scrolled up; animate it in/out.
- **Do** include the new-message count when there is one.
- **Don't** keep it permanently visible.
- **Don't** use it as a generic scroll-to-top control elsewhere.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-jump-to-latest`, `__count`) | ✅ | |
| §7 a11y (button/role + keyboard; count in name) | ✅ | |
| §8 tokens | ✅ | `surface-overlay` + `shadow-md/lg` |

## Notes / TODO

- Show/hide-on-scroll and the smooth-scroll behaviour are the usage site's responsibility.
