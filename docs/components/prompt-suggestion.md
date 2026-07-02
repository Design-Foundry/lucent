# Prompt suggestion — `<lucent-prompt-suggestion>`

> A clickable starter for an empty chat — "Summarise this doc", "Write a unit test". Gives users
> a way in when the conversation is blank. `card` is roomy (icon + title + optional description);
> `chip` is a compact pill for a row of quick starters.

**Tier:** Messaging
**Targets:** `LucentPromptSuggestion` (Angular · `lucent-prompt-suggestion`) · `PromptSuggestion` (React) · `<lucent-prompt-suggestion>` (Web Components) · `LucentPromptSuggestion` (Blazor)
**Source:** [`../../packages/angular/src/prompt-suggestion/prompt-suggestion.ts`](../../packages/angular/src/prompt-suggestion/prompt-suggestion.ts) · CSS [`../../styles/components/prompt-suggestion.css`](../../styles/components/prompt-suggestion.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `PromptSuggestionVariant` | `'card'` | `card` (roomy) · `chip` (pill) |
| `label` | input | `string` | `''` | The prompt / title |
| `description` | input | `string` | `''` | Second line (card only) |
| `icon` | input | `string` | `''` | Leading glyph |
| `selected` / `onSelect` | output | `string` | — | Emits the prompt label on activation (`select` event in WC) |

**Exported types:** `PromptSuggestionVariant = 'card' | 'chip'`

## When to use

- **Empty-state starters** — a small set (3–6) that seed common tasks and teach what the agent can do.
- Use **`card`** in a grid on the empty screen; **`chip`** for a compact inline row (e.g. above
  the composer).
- Once the conversation is going, drop them — they're an on-ramp, not persistent chrome.

## Usage

```html
<!-- Angular -->
<lucent-prompt-suggestion icon="summarize" label="Summarise this doc"
  description="Key points in a few bullets" (selected)="send($event)" />
```
```tsx
/* React */
<PromptSuggestion variant="chip" label="Write a test" onSelect={send} />
```
```razor
@* Blazor *@
<LucentPromptSuggestion Icon="summarize" Label="Summarise this doc" Selected="Send" />
```

## Composition

- `card` composes an `icon` (accent), a title, and an optional description; `chip` is a single-line pill.
- Lives in the empty-state block or above the `composer`; on `select`, the usage site typically
  fills the composer or sends the prompt.

## States & accessibility

- It's a real button (React/Blazor) or a `role="button"` host with Enter/Space (Angular/WC),
  with `:focus-visible` focus ring — fully keyboard operable.
- Give each a clear, action-shaped label.

## Do / Don't

- **Do** keep the set short and task-shaped ("Explain this error").
- **Do** hide them once the user is chatting.
- **Don't** overload with long descriptions — a line at most.
- **Don't** use them for navigation; they seed a prompt.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-prompt-suggestion`, `--variant`, `__*`) | ✅ | |
| §5 content model (`label` + projection) | ✅ | |
| §4 output (`selected`, past-tense-ish action) | ✅ | Emits the prompt |
| §7 a11y (button/role + keyboard + focus) | ✅ | |
| §8 tokens | ✅ | Accent icon, surface/border tokens |

## Notes / TODO

- A selected/pressed state isn't needed (it's a one-shot action); if a persistent chosen state
  is wanted, use `chip` with `type="active"` instead.
