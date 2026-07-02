# Reference tag — `<lucent-reference-tag>`

> A small inline chip that references an entity **inside prose** — an @mention, a component, a
> design token (with a colour swatch + mono name), or a resource (PR, doc). Type-aware leading;
> it flows and wraps with the surrounding text. The connective tissue of chat & discussion bodies.

**Tier:** Messaging
**Targets:** `LucentReferenceTag` (Angular · `lucent-reference-tag`) · `ReferenceTag` (React) · `<lucent-reference-tag>` (Web Components) · `LucentReferenceTag` (Blazor)
**Source:** [`../../packages/angular/src/reference-tag/reference-tag.ts`](../../packages/angular/src/reference-tag/reference-tag.ts) · CSS [`../../styles/components/reference-tag.css`](../../styles/components/reference-tag.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `kind` | input | `ReferenceKind` | `'mention'` | Host class + default glyph |
| `label` | input | `string` | `''` | Text; projected content overrides it |
| `icon` | input | `string` | (per kind) | Override the glyph |
| `swatch` | input | `string` | `''` | For `token`: a CSS colour shown as a swatch |

**Exported types:** `ReferenceKind = 'mention' | 'component' | 'token' | 'resource'`

## When to use

- **`mention`** — a person or the agent (`@Sarah`, `@Lucent`), accent-tinted.
- **`component`** — a design-system component (`Button`), `widgets` glyph.
- **`token`** — a design token (`accent/default`) with its resolved colour swatch and a mono name.
- **`resource`** — an external thing (`PR #128`, a doc), `link` glyph.

Reach for it whenever a message names a *known* entity, so the reference is scannable and (later)
linkable — rather than plain text the reader has to parse.

## Usage

```html
<!-- Web Components -->
<lucent-reference-tag kind="mention" label="Lucent"></lucent-reference-tag>
<lucent-reference-tag kind="component" label="Button"></lucent-reference-tag>
<lucent-reference-tag kind="token" label="accent/default" swatch="#5b8c74"></lucent-reference-tag>
<lucent-reference-tag kind="resource" label="PR #128"></lucent-reference-tag>
```
```tsx
/* React */
<ReferenceTag kind="mention" label="Lucent" />
<ReferenceTag kind="token" label="accent/default" swatch="#5b8c74" />
```
```razor
@* Blazor *@
<LucentReferenceTag Kind="ReferenceKind.Mention" Label="Lucent" />
<LucentReferenceTag Kind="ReferenceKind.Token" Label="accent/default" Swatch="#5b8c74" />
```

## Composition

- Renders a leading `icon` (per-kind default, overridable) — or, for `token`, a colour swatch —
  plus the label. Mono label for tokens.
- Designed to sit **inside** `message-bubble` bodies and discussion posts: place them in a
  wrapping flow container so runs of text and tags reflow together.

## States & accessibility

- Inline, non-interactive by default (a reference marker). If a usage site makes it navigable,
  wrap it in a link and give that link an accessible name.
- The kind is conveyed by glyph/shape + text, not colour alone (mention's tint is reinforced by
  the `@` glyph).

## Do / Don't

- **Do** use the right `kind` so the glyph matches the entity.
- **Do** show the resolved colour on `token` tags.
- **Don't** overuse them — a paragraph dense with chips is harder to read than prose.
- **Don't** encode meaning in the tint alone.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-reference-tag`, `--kind`, `__*`) | ✅ | |
| §5 content model (`label` + projection) | ✅ | |
| §7 a11y (glyph + text, not colour alone) | ✅ | |
| §8 tokens | ✅ | Mention tint via `color-mix`; mono for tokens |

## Notes / TODO

- An optional interactive/link mode (navigate to the entity) can be layered on; today it's a
  static inline marker.
