# Chat trigger (FAB) — `<lucent-chat-trigger>`

> The floating action button that opens the chat — an accent circle with a lifted shadow and an
> optional unread badge. The persistent "talk to the agent" affordance in the corner of an app.

**Tier:** Messaging
**Targets:** `LucentChatTrigger` (Angular · `lucent-chat-trigger`) · `ChatTrigger` (React) · `<lucent-chat-trigger>` (Web Components) · `LucentChatTrigger` (Blazor)
**Source:** [`../../packages/angular/src/chat-trigger/chat-trigger.ts`](../../packages/angular/src/chat-trigger/chat-trigger.ts) · CSS [`../../styles/components/chat-trigger.css`](../../styles/components/chat-trigger.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `icon` | input | `string` | `'forum'` | Glyph in the FAB |
| `unread` | input | `number` | `0` | Shows an error-variant count `badge` when > 0 (clamps `99+`) |
| `ariaLabel` / `label` | input | `string` | `'Open chat'` | Accessible name; unread count appended automatically |
| `clicked` / `onClick` | output | — | — | Opens the chat |

## When to use

- The single, persistent entry to the chat when there's no room for a docked panel (bottom-right
  corner, over content).
- A **sidebar** entry-point should reuse `nav-icon` instead — only this floating variant is bespoke.
- Show `unread` when messages arrived while the panel was closed.

## Usage

```html
<lucent-chat-trigger [unread]="3" (clicked)="openChat()" />          <!-- Angular -->
```
```tsx
<ChatTrigger unread={3} onClick={openChat} />                         {/* React */}
```
```razor
<LucentChatTrigger Unread="3" OnClick="OpenChat" />                   @* Blazor *@
```

## Composition

- Composes `icon` (the glyph) and, when `unread > 0`, a `badge` (`kind="count"`, `variant="error"`)
  positioned top-right.
- Pairs with the chat panel it opens (docked / floating / full-width layouts).

## States & accessibility

- A real button (React/Blazor) / `role="button"` host with Enter/Space (Angular/WC), with a
  `:focus-visible` ring. Lifts its shadow on hover, nudges on active.
- The accessible name folds in the unread count ("Open chat, 3 unread"), so the badge isn't the
  only cue.

## Do / Don't

- **Do** keep it fixed in a consistent corner; one per surface.
- **Do** clear `unread` when the panel opens.
- **Don't** use it where a `nav-icon` sidebar entry fits better.
- **Don't** rely on the badge alone — the label carries the count.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-chat-trigger`, `__badge`) | ✅ | |
| §5 composition (icon + badge) | ✅ | References child components |
| §7 a11y (button/role + keyboard; count in name) | ✅ | |
| §8 tokens | ✅ | Accent surface, `shadow-lg/xl` |

## Notes / TODO

- Position (fixed bottom-right, safe-area insets) is the usage site's responsibility.
