# `DfBreadcrumbs` — `<df-breadcrumbs>`

> A breadcrumb trail rendered from an array of items. Emits a click event for non-last items.

**Tier:** Navigation
**Selector:** `df-breadcrumbs`
**Source:** [`../../breadcrumbs/breadcrumbs.ts`](../../breadcrumbs/breadcrumbs.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `items` | input | `BreadcrumbItem[]` | `[]` | Rendered internally as `<span>`s |
| `itemClick` | output | `BreadcrumbItem` | — | Fires for non-last items on click |

```ts
interface BreadcrumbItem { label: string; path?: string; data?: unknown; }
```

**Content slots:** none (array-driven only).
**Exported types:** `BreadcrumbItem`

## Usage

```html
<df-breadcrumbs [items]="trail" (itemClick)="navigate($event)" />
```
```ts
trail: BreadcrumbItem[] = [{ label: 'Home', path: '/' }, { label: 'Projects' }];
```

## Composition

- Array-driven collection (no projection variant). The last item is rendered as current
  (`is-last`) and is not clickable.

## States & accessibility

- **Significant a11y gaps:** renders `<span>`s, not `<nav><ol><li><a>`; no
  `aria-label="Breadcrumb"`, no `aria-current="page"` on the last item, no real links /
  `routerLink` (so no middle-click/open-in-new-tab). Separator is `aria-hidden` (good).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ⚠️ | Array-only; `path` exists but isn't used as a link |
| §4 output naming | ❌ | `itemClick` (noun-Click) → should be `activated` ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 typed value | ❌ | `data?: unknown` — not generic |
| §7 a11y | ❌ | No nav/ol/anchor/`aria-current` ([API-AUDIT §6](../API-AUDIT.md)) |
| §8 tokens | ✅ | |

## Notes / TODO

- Rebuild as `<nav aria-label="Breadcrumb"><ol><li><a routerLink>` with `aria-current="page"`
  on the last; rename `itemClick` → `activated`; make `BreadcrumbItem<T>` generic
  ([API-PROPOSAL §Rule 6](../API-PROPOSAL.md)). Also fix `track item.label` (fragile on
  duplicate labels).
