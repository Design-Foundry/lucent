# Divider — `<lucent-divider>`

> The unified separator. **`plain`** is a hairline rule; **`labeled`** is a rule with centered
> text ("Today", "OLDER", a section label). One component to separate anything — the canonical
> replacement for the older `nav-divider` / `menu-divider` (which remain for now; this is additive).

**Tier:** Primitive
**Targets:** `LucentDivider` (Angular · `lucent-divider`) · `Divider` (React) · `<lucent-divider>` (Web Components) · `LucentDivider` (Blazor)
**Source:** [`../../packages/angular/src/divider/divider.ts`](../../packages/angular/src/divider/divider.ts) · CSS [`../../styles/components/divider.css`](../../styles/components/divider.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `variant` | input | `DividerVariant` | `'plain'` | `plain` (rule) · `labeled` (rule + centered text) |
| `label` | input | `string` | `''` | Text for `labeled`; projected content overrides it |

**Exported types:** `DividerVariant = 'plain' | 'labeled'`

## When to use

- **`plain`** — separate items in a menu, sections in a nav rail, groups in a form. Prefer this
  over the legacy `nav-divider`/`menu-divider` going forward (one component, same hairline).
- **`labeled`** — a date break in a message stream ("Today"), or a labelled section boundary.

## Usage

```html
<lucent-divider></lucent-divider>                              <!-- plain -->
<lucent-divider variant="labeled" label="Today"></lucent-divider>
```
```tsx
<Divider />                                                     {/* React */}
<Divider variant="labeled" label="Today" />
```
```razor
<LucentDivider />                                               @* Blazor *@
<LucentDivider Variant="DividerVariant.Labeled" Label="Today" />
```

## Composition

- `plain` renders as an empty rule; `labeled` flanks the label with two rule segments (CSS
  pseudo-elements) so the text sits centred between hairlines.
- Renders no sub-components.

## States & accessibility

- Host is `role="separator"`. The labeled text is read as part of the separator, giving the
  boundary meaning ("separator, Today").
- Purely presentational otherwise — no focus or interaction.

## Do / Don't

- **Do** reach for this as the single divider for new work.
- **Do** keep labeled text short and title-cased.
- **Don't** overuse dividers where whitespace would group content just as well.
- **Don't** use a divider as a heading — it's a boundary, not a title.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-divider`, `--variant`) | ✅ | |
| §7 a11y (`role="separator"`) | ✅ | |
| §8 tokens | ✅ | `border-subtle` rule, text-muted label |

## Notes / TODO

- Additive: `nav-divider` and `menu-divider` still ship; migrate usages to `divider` over time,
  then deprecate them.
