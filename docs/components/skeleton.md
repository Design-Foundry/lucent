# Skeleton — `<lucent-skeleton>`

> A shimmering placeholder that reserves a piece of layout while its real content loads.
> Prevents the jarring reflow of content popping in, and reads as "loading" without a spinner.

**Tier:** Feedback
**Targets:** `LucentSkeleton` (Angular · `lucent-skeleton`) · `Skeleton` (React) · `<lucent-skeleton>` (Web Components) · `LucentSkeleton` (Blazor)
**Source:** [`../../packages/angular/src/skeleton/skeleton.ts`](../../packages/angular/src/skeleton/skeleton.ts) · CSS [`../../styles/components/skeleton.css`](../../styles/components/skeleton.css)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `shape` | input | `SkeletonShape` | `'line'` | Host class `lucent-skeleton--<shape>` |

**Exported types:** `SkeletonShape = 'line' | 'circle' | 'block'`

Width/height are left to the usage site — set an inline `style` (`width`, `height`) to match
the real content it stands in for.

## When to use

- **`line`** — a line of text (heading, label, paragraph row). Stack a few at varied widths
  to mimic a paragraph.
- **`circle`** — an avatar or round icon. Override the inline size to match the avatar scale.
- **`block`** — an image, thumbnail, or card body. Set the height to the real block.

Use a skeleton when you know the *shape* of what's coming (a list, a profile card). If you
don't, a `spinner` is honest about the unknown.

## Usage

```html
<lucent-skeleton shape="circle" style="width:40px;height:40px"></lucent-skeleton>
<lucent-skeleton shape="line" style="width:60%"></lucent-skeleton>
```
```tsx
<Skeleton shape="block" style={{ height: 120 }} />   {/* React */}
```
```razor
<LucentSkeleton Shape="SkeletonShape.Line" style="width:60%" />   @* Blazor *@
```

## Composition

- Renders no sub-components — a single element with a CSS shimmer sweep (a moving highlight
  gradient over a light-gray fill).
- Compose several into the exact silhouette of the pending content (avatar circle + two
  lines = a comment row).

## States & accessibility

- **Decorative** — carries `aria-hidden="true"`. Do not announce each shard.
- Announce the wait once on the **container**: `aria-busy="true"` while loading, then swap in
  the real content and drop it.
- Honours `prefers-reduced-motion` — the sweep is replaced by a gentle opacity pulse.

## Do / Don't

- **Do** match the skeleton's size/shape to the content it replaces, so nothing jumps.
- **Do** put `aria-busy` on the region, not the skeletons.
- **Don't** animate aggressively or use high-contrast fills — it should recede, not flash.
- **Don't** leave skeletons up on error; swap to an error/empty state.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-skeleton`, `--shape`) | ✅ | |
| §7 a11y (decorative; container `aria-busy`) | ✅ | |
| §8 tokens | ✅ | Semantic tokens + `color-mix` |

## Notes / TODO

- A convenience `lines` count (multi-line paragraph) could be added later; for now compose
  multiple `line` skeletons.
