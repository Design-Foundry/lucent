# `DfBreadcrumbs` — `<df-breadcrumbs>`

> A breadcrumb trail rendered from an array of items. A crumb with a `path` renders as a real
> link; the last crumb is the current page. Non-last crumbs without a `path` emit a click event.

**Tier:** Navigation
**Selector:** `df-breadcrumbs`
**Source:** [`../../breadcrumbs/breadcrumbs.ts`](../../breadcrumbs/breadcrumbs.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `items` | input | `BreadcrumbItem[]` | `[]` | A crumb with a `path` renders as `<a href>`; without one, a `<span>` |
| `itemClick` | output | `BreadcrumbItem` | — | Fires for non-last, **path-less** items on click (path-ed crumbs navigate via their anchor) |

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
// 'Home' and 'Projects' render as <a href> links; 'Overview' is the current page.
trail: BreadcrumbItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Overview' },
];
```

## Composition

- Array-driven collection (no projection variant). Rendered as
  `<nav aria-label="Breadcrumb"><ol><li>` with each crumb an `<a href>` (when it has a `path`)
  or a `<span>` (when it doesn't). The last item is the current page (`is-last`,
  `aria-current="page"`), muted and non-interactive.
- **Navigation is the anchor, not the event.** A crumb with a `path` is a real link — it works
  without a live JS/circuit (so it navigates under static SSR), supports middle-click /
  open-in-new-tab, and is picked up by client routers for SPA navigation. `itemClick` remains for
  crumbs that navigate programmatically (no `path`).

## States & accessibility

- Wrapped in a `<nav aria-label="Breadcrumb">` landmark; crumbs are an `<ol>`/`<li>` list.
- Crumbs with a `path` are real anchors (`<a href>`): keyboard-focusable, middle-clickable,
  announced as links by assistive tech.
- The last (current) crumb carries `aria-current="page"`. Separators are `aria-hidden` (good).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ✅ | Array model; `path` renders as a real link |
| §4 output naming | ❌ | `itemClick` (noun-Click) → should be `activated` ([API-AUDIT §5](../API-AUDIT.md)) |
| §4 typed value | ❌ | `data?: unknown` — not generic |
| §7 a11y | ✅ | `nav`/`ol`/`li`/anchor + `aria-current="page"` |
| §8 tokens | ✅ | |

## Notes / TODO

- Rename `itemClick` → `activated`; make `BreadcrumbItem<T>` generic
  ([API-PROPOSAL §Rule 6](../API-PROPOSAL.md)). Also fix `track item.label` (fragile on
  duplicate labels).
- Angular/React emit plain `<a href>` for path-ed crumbs (router-agnostic). Consumers wanting
  in-framework SPA transitions can layer `routerLink` / `<Link>` on top; the Blazor kit is
  already intercepted by the Blazor router.
