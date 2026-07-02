# Composer — `<lucent-composer>`

> The message input for chat & messaging. A borderless auto-growing textarea plus a send button
> that **morphs with state**: send → loading (while submitting) → stop ■ (while the agent
> streams). Enter sends; Shift+Enter is a newline. Composes textarea + icon-button (+ spinner).

**Tier:** Messaging
**Targets:** `LucentComposer` (Angular · `lucent-composer`) · `Composer` (React) · `<lucent-composer>` (Web Components) · `LucentComposer` (Blazor)
**Source:** [`../../packages/angular/src/composer/composer.ts`](../../packages/angular/src/composer/composer.ts) · CSS [`../../styles/components/composer.css`](../../styles/components/composer.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `value` | model / input | `string` | `''` | Two-way |
| `placeholder` | input | `string` | `'Message…'` | |
| `size` | input | `ControlSize` | `'md'` | Density (`xs→sm` for the button) |
| `disabled` | input | `boolean` | `false` | Whole composer off |
| `sending` | input | `boolean` | `false` | Submitting — send shows a spinner |
| `streaming` | input | `boolean` | `false` | Agent streaming — send morphs to Stop |
| `send` / `onSend` | output | `string` | — | The trimmed message |
| `stop` / `onStop` | output | — | — | Stop the stream |

## State model

The Figma states map to props: **empty** = no `value` (send disabled) · **active** = `value`
present (send enabled) · **disabled** · **sending** (spinner) · **streaming** (Stop button).

## When to use

- The single input at the foot of any chat/messaging surface (side panel, floating, full width).
- Pair `streaming` with a `typing-indicator` (generating) in the stream; the Stop button cancels.
- Use a plain `textarea` for ordinary multi-line form fields — the composer is chat-specific.

## Usage

```html
<!-- Angular -->
<lucent-composer [(value)]="draft" [streaming]="isStreaming()"
  (send)="onSend($event)" (stop)="onStop()" />
```
```tsx
/* React */
<Composer value={draft} onChange={setDraft} sending={isSending}
  onSend={send} onStop={stop} />
```
```razor
@* Blazor *@
<LucentComposer @bind-Value="draft" Streaming="isStreaming" Send="OnSend" Stop="OnStop" />
```

## Composition

- Wraps a borderless `textarea` (the `composer__field`) and an `icon-button` in the actions area.
  While `sending`, the button is in its loading state (JS kits) / a `spinner` (Blazor); while
  `streaming` it becomes a **Stop** icon-button.
- Sits under the message log; starters (`prompt-suggestion`) can sit just above it.

## States & accessibility

- Enter sends, Shift+Enter inserts a newline (JS kits). The Blazor kit sends via the button;
  Enter-to-send is app-wired (Blazor can't conditionally `preventDefault` per keystroke without
  interop) — or use the Web Components kit.
- The send/stop control is an icon-button with an accessible label ("Send" / "Stop generating").
- Focus ring on the whole field via `:focus-within`; disabled dims and blocks input.

## Do / Don't

- **Do** disable send when the field is empty; show Stop only while streaming.
- **Do** clear the field after send (the JS kits clear on `send`).
- **Don't** leave the send button active during a stream — offer Stop instead.
- **Don't** use it as a generic form textarea.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-composer`, `__field`, `__actions`) | ✅ | |
| §5 composition (textarea + icon-button + spinner) | ✅ | References child components |
| §6 state (`disabled`/`sending`/`streaming`) | ✅ | |
| §7 a11y (labelled control; focus-within) | ✅ ⚠️ | Blazor Enter-to-send is app-wired |
| §8 tokens | ✅ | Glass field, control-text density |
| §10 density | ✅ | `xs/sm/md/lg` |

## Notes / TODO

- Auto-grow is capped by CSS `max-height` then scrolls; a JS autosize could refine it.
- Leading actions (attach, etc.) can be added to `__actions`; today it's the send/stop control.
