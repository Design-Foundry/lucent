# Code block — `<lucent-code-block>`

> A fenced code block with a language label and a copy button — for code the agent returns or a
> user pastes into a message. Monospace, horizontally scrollable, whitespace-preserving.

**Tier:** Messaging
**Targets:** `LucentCodeBlock` (Angular · `lucent-code-block`) · `CodeBlock` (React) · `<lucent-code-block>` (Web Components) · `LucentCodeBlock` (Blazor)
**Source:** [`../../packages/angular/src/code-block/code-block.ts`](../../packages/angular/src/code-block/code-block.ts) · CSS [`../../styles/components/code-block.css`](../../styles/components/code-block.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `language` | input | `string` | `''` | Label shown in the header |
| `code` | input | `string` | `''` | The code text (rendered in `<pre><code>`) |

The copy button lives in the header and copies `code` to the clipboard.

## When to use

- **Fenced code inside a message** — a snippet the agent produced, or code a user shares.
- For a short inline token/identifier, use `tag` (mono) instead of a full block.
- For live-editable code, use a `textarea`/editor — this is read + copy.

## Usage

```html
<lucent-code-block language="ts" code="const x = 1;"></lucent-code-block>   <!-- WC -->
```
```tsx
<CodeBlock language="tsx" code={snippet} />                                  {/* React */}
```
```razor
<LucentCodeBlock Language="csharp" Code="@snippet" />                        @* Blazor *@
```

## Composition

- Renders a header (language label + copy `icon-button`) and a `<pre><code>` body.
- Sits inside a `message-bubble` body in an AI-chat or discussion stream.

## States & accessibility

- The copy button is a real button with an accessible label; the JS kits briefly swap the glyph
  to a check on success. The Blazor copy is a static-SSR inline handler (reads the sibling
  `<code>` text — no JS interop needed).
- The `<pre><code>` structure preserves whitespace and is announced as code content.

## Do / Don't

- **Do** set an accurate `language` label.
- **Do** keep the block scrollable rather than wrapping long lines.
- **Don't** use it for prose or single identifiers (use `tag`).
- **Don't** put untrusted HTML in `code` — it renders as text, keep it that way.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-code-block`, `__header`, `__body`) | ✅ | |
| §7 a11y (labelled copy button; `pre`/`code`) | ✅ | |
| §8 tokens | ✅ | Mono font token, surface/border tokens |

## Notes / TODO

- Syntax highlighting is out of scope (bring your own highlighter into `code` as needed); the
  block owns the chrome, copy, and layout.
