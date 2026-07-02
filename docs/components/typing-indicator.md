# Typing / generating indicator — `<lucent-typing-indicator>`

> The live "…" that sits in the stream where the next message will appear. **`typing`** = a
> person is composing; **`generating`** = the agent is producing a reply (accent dots + an
> optional label). It's how the conversation signals "hold on, more is coming".

**Tier:** Messaging
**Targets:** `LucentTypingIndicator` (Angular · `lucent-typing-indicator`) · `TypingIndicator` (React) · `<lucent-typing-indicator>` (Web Components) · `LucentTypingIndicator` (Blazor)
**Source:** [`../../packages/angular/src/typing-indicator/typing-indicator.ts`](../../packages/angular/src/typing-indicator/typing-indicator.ts) · CSS [`../../styles/components/typing-indicator.css`](../../styles/components/typing-indicator.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `TypingVariant` | `'typing'` | `typing` (person) · `generating` (agent) |
| `label` | input | `string` | `''` | Defaults to "Generating…" for the generating variant |

**Exported types:** `TypingVariant = 'typing' | 'generating'`

## When to use

- **`typing`** — another person is composing in a human thread.
- **`generating`** — the agent is producing a reply (pair with a stop control on the `composer`).
- Show it in the stream where the pending bubble will land; remove it when the message arrives.

## Usage

```html
<lucent-typing-indicator variant="typing"></lucent-typing-indicator>            <!-- WC -->
<lucent-typing-indicator variant="generating" label="Thinking…"></lucent-typing-indicator>
```
```tsx
<TypingIndicator variant="generating" />                                         {/* React */}
```
```razor
<LucentTypingIndicator Variant="TypingVariant.Generating" />                      @* Blazor *@
```

## Composition

- Renders three animated dots (accent for `generating`) and an optional label — no
  sub-components.
- Lives beside `message-bubble`s in the log; while `generating`, the `composer` is in its
  streaming-lock state.

## States & accessibility

- `role="status"` + `aria-live="polite"` with an `aria-label` ("Typing"/"Generating"), so
  assistive tech announces the wait without stealing focus. The dots are `aria-hidden`.
- Honours `prefers-reduced-motion` (dots pulse instead of bounce).

## Do / Don't

- **Do** remove it the instant the message renders.
- **Do** use `generating` (accent) for the agent so it reads as system activity.
- **Don't** leave it up on error — swap to an `inline-notice`.
- **Don't** show several at once in one stream.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-typing-indicator`, `--variant`, `__dot`) | ✅ | |
| §7 a11y (`status`/`aria-live`, reduced motion) | ✅ | |
| §8 tokens | ✅ | Accent dots for generating; text tokens |

## Notes / TODO

- A per-author avatar could precede the dots at the usage site (composition).
