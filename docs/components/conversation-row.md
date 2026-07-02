# Conversation row — `<lucent-conversation-row>`

> One entry in a conversation/inbox list: who (avatar) + last-message preview + time + unread
> count. Rest / hover / **active** (the currently-open thread). The left rail of a chat or the
> rows of a messages inbox.

**Tier:** Messaging
**Targets:** `LucentConversationRow` (Angular · `lucent-conversation-row`) · `ConversationRow` (React) · `<lucent-conversation-row>` (Web Components) · `LucentConversationRow` (Blazor)
**Source:** [`../../packages/angular/src/conversation-row/conversation-row.ts`](../../packages/angular/src/conversation-row/conversation-row.ts) · CSS [`../../styles/components/conversation-row.css`](../../styles/components/conversation-row.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `title` | input | `string` | `''` | Name / conversation title |
| `preview` | input | `string` | `''` | Last-message snippet (truncates) |
| `time` | input | `string` | `''` | Timestamp string |
| `unread` | input | `number` | `0` | Accent count `badge` when > 0 (`99+`) |
| `active` | input | `boolean` | `false` | The open thread (`aria-current`) |
| `selected` / `onSelect` | output | — | — | Row chosen |

**Leading avatar:** projected — `lucentLeading` (Angular) · `avatar` prop (React) · light-DOM child (WC) · `Avatar` fragment (Blazor).

## When to use

- The list of conversations beside/above an open chat, or a standalone messages inbox.
- For a generic selectable row without the messaging metadata, use `list-item`.

## Usage

```html
<!-- Angular -->
<lucent-conversation-row title="Design sync" preview="Sarah: shipped the tokens"
  time="9:41" [unread]="2" [active]="id === openId" (selected)="open(id)">
  <lucent-avatar lucentLeading scale="sm" label="DS" />
</lucent-conversation-row>
```
```tsx
/* React */
<ConversationRow title="Design sync" preview="Sarah: shipped the tokens" time="9:41"
  unread={2} active={id === openId} avatar={<Avatar scale="sm" label="DS" />} onSelect={() => open(id)} />
```
```razor
@* Blazor *@
<LucentConversationRow Title="Design sync" Preview="Sarah: shipped the tokens" Time="9:41"
  Unread="2" Active="@(id == openId)" OnClick="() => Open(id)">
  <Avatar><LucentAvatar Scale="AvatarScale.Sm" Label="DS" /></Avatar>
</LucentConversationRow>
```

## Composition

- Composes a leading `avatar`, a title + preview column, and a meta column (time + unread
  `badge`). Stack rows inside a `list` or a scroll container.

## States & accessibility

- A button (React/Blazor) / `role="button"` host (Angular/WC) with Enter/Space and a
  `:focus-visible` ring. The open row carries `aria-current="true"`.
- The accessible name includes the unread count; the badge is a reinforcement, not the only cue.
- Title and preview truncate with ellipsis — keep the full text available on hover/detail.

## Do / Don't

- **Do** mark the open conversation `active`.
- **Do** keep previews to one line; let the thread show the rest.
- **Don't** put multiple actions in the row — it's a single open target.
- **Don't** use it as a generic list row (use `list-item`).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-conversation-row`, `is-active`, `__*`) | ✅ | |
| §5 composition (avatar + badge; projected leading) | ✅ | |
| §6 state (`active` → `aria-current`) | ✅ | |
| §7 a11y (button/role + keyboard; count in name) | ✅ | |
| §8 tokens | ✅ | Hover `surface-base`, active darker via `oklch` |

## Notes / TODO

- A pinned/muted indicator and swipe actions are usage-site composition, not baked in.
