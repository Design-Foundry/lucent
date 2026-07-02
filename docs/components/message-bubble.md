# Message bubble — `<lucent-message-bubble>`

> One bubble for **AI chat and human messaging**. Carries a sender role, an optional author +
> timestamp, and a rich body. `user` is accent-tinted with a tail; `assistant`/`other` are
> surface bubbles; `system` is a quiet centered note. The agent is a first-class participant.

**Tier:** Messaging
**Targets:** `LucentMessageBubble` (Angular · `lucent-message-bubble`) · `MessageBubble` (React) · `<lucent-message-bubble>` (Web Components) · `LucentMessageBubble` (Blazor)
**Source:** [`../../packages/angular/src/message-bubble/message-bubble.ts`](../../packages/angular/src/message-bubble/message-bubble.ts) · CSS [`../../styles/components/message-bubble.css`](../../styles/components/message-bubble.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `role` / `sender` | input | `MessageRole` | `'assistant'` | `role` in Angular/React/Blazor; **`sender`** in WC (avoids the ARIA `role` attribute) |
| `group` | input | `MessageGroup` | `'standalone'` | `continuation` drops the tail |
| `author` | input | `string` | `''` | Optional meta line name |
| `timestamp` | input | `string` | `''` | Optional meta line time |

**Content:** the message body projects as children (rich — text, `reference-tag`, `code-block`).
**Exported types:** `MessageRole = 'user' | 'assistant' | 'system' | 'other'` · `MessageGroup = 'standalone' | 'continuation'`

## When to use

- **`user`** — the human's own messages (accent tint, tail).
- **`assistant`** — the AI agent's replies.
- **`other`** — another human in a group/discussion thread.
- **`system`** — a status line ("Sarah joined", "Context cleared") — centered, muted, no bubble.

Use **`continuation`** for a consecutive message from the same sender to tighten the run (no tail).

## Usage

```html
<!-- Angular -->
<lucent-message-bubble role="assistant" author="Lucent" timestamp="9:41">
  Here's the summary you asked for…
</lucent-message-bubble>
```
```tsx
/* React */
<MessageBubble role="user" group="standalone">Can you refactor this?</MessageBubble>
```
```html
<!-- Web Components (sender, not role) -->
<lucent-message-bubble sender="assistant" author="Lucent">Done ✓</lucent-message-bubble>
```
```razor
@* Blazor *@
<LucentMessageBubble Role="MessageRole.User">Can you refactor this?</LucentMessageBubble>
```

## Composition

- The body embeds other Lucent components: `reference-tag` (@mentions, tokens), `code-block`
  (fenced code), `inline-notice` (in-stream errors).
- **Alignment is the container's job.** Wrap each bubble in a full-width row and set
  `justify-content: flex-end` for `user`, `flex-start` for others — so the same bubble works in
  any layout (side panel, floating, full width).

## States & accessibility

- The bubble is presentational; put the conversation in a labelled log region at the usage site
  (`role="log"`), and convey sender via the visible author, not colour alone.
- `system` notes read as centered status text.
- WC uses `sender` (not `role`) so it never emits an invalid ARIA `role`.

## Do / Don't

- **Do** show an author for group/human threads and for the agent.
- **Do** use `continuation` to group a sender's run.
- **Don't** rely on tint alone to distinguish sender — keep the author/label.
- **Don't** bake left/right alignment into the bubble; align at the row.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-message-bubble`, `--role`, `--group`) | ✅ | |
| §5 content model (projected body) | ✅ | |
| §7 a11y (author over colour; log at usage site) | ✅ | WC `sender` avoids ARIA `role` clash |
| §8 tokens | ✅ | User tint via `color-mix`; tail via corner radius |

## Notes / TODO

- An avatar slot and reactions bar are composition at the usage site (see the discussion-board
  example) rather than baked in.
