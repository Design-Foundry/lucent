# `DfAvatar` — `<df-avatar>`

> A user/tenant avatar — image when `src` is given, otherwise initials from `name`. Optional
> name/tenant labels on either side.

**Tier:** Form input (identity display)
**Selector:** `df-avatar`
**Source:** [`../../avatar/avatar.ts`](../../avatar/avatar.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `src` | input | `string` | `''` | Image URL; falls back to initials when empty |
| `name` | input | `string` | `''` | Drives initials + label + `<img alt>` |
| `tenant` | input | `string` | `''` | Secondary label (shown only at `md`/`lg`) |
| `scale` | input | `AvatarScale` | `'md'` | |
| `variant` | input | `AvatarVariant` | `'trailing'` | Label placement: `leading` / `trailing` / `none` |

**Content slots:** none.
**Exported types:** `AvatarScale = 'xs' \| 'sm' \| 'md' \| 'lg'` · `AvatarVariant = 'trailing' \| 'leading' \| 'none'`

## Usage

```html
<df-avatar [src]="user.photo" [name]="user.name" />
<df-avatar [name]="user.name" tenant="Acme" variant="leading" scale="lg" />
<df-avatar dfLeading [name]="m.name" variant="none" />   <!-- as a list-item leading slot -->
```

## Composition

- Common `dfLeading` adornment in `df-list-item` rows.
- `initials` and `showTenant` are computed; `<img>` uses `alt={{name}}`.

## States & accessibility

- Image path has `alt` from `name`. Initials path has **no text alternative / role** — a
  screen reader gets nothing when there's no image. Consider an `aria-label`.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §4 signal inputs / typed | ✅ | |
| §7 a11y | ⚠️ | Initials fallback has no accessible name |
| §8 tokens | ✅ | |

## Notes / TODO

- Add an accessible name for the initials fallback (e.g. `aria-label="{{name}}"`).
- `variant` naming (`leading`/`trailing`) overlaps the adornment vocabulary but means
  *label side* here — worth disambiguating during the §2 sweep.
