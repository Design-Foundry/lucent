# Design Foundry UI

The Design Foundry component kit — 31 standalone Angular components, 3 overlay services, and
a 3-tier design-token system with light/dark theming. Built for **Angular 21** (standalone,
zoneless, signals). Only runtime dependency beyond Angular is **`@angular/cdk`**.

> Status: currently consumed in-repo via the `@ds` path alias. Packaging for external
> distribution is planned — see [DISTRIBUTION.md](./DISTRIBUTION.md). The setup below
> describes the consumer contract that a published package must satisfy.

---

## Install

```bash
npm install @design-foundry/ui @angular/cdk
```

`@angular/core`, `@angular/common`, and `@angular/forms` are peer dependencies you already
have in an Angular app.

## Required global setup

The components are styled entirely with CSS custom properties and depend on a few global
assets. **Wire up all four or components render broken** (unstyled, wrong fonts, no icons,
mispositioned overlays).

### 1. Design tokens & base styles
Import the token layer **before** any component styles. With Dart Sass:

```scss
// styles.scss
@use '@design-foundry/ui/styles';   // primitives → semantic → composite + dark theme
```

The layers, in required order, are: `tokens` → `semantic-colors` → `surfaces` → `borders` →
`shadows` → `typography` → `themes` (themes last — it overrides the light defaults for dark
mode). Not using Sass? Import the precompiled stylesheet instead:

```css
@import '@design-foundry/ui/styles.css';
```

### 2. CDK overlay styles
Modals, dialogs, selects, menus, tooltips, toasts, and snackbars use CDK overlays:

```jsonc
// angular.json → architect.build.options.styles
"styles": [
  "node_modules/@angular/cdk/overlay-prebuilt.css",
  "src/styles.scss"
]
```

### 3. Icon font (Material Icons)
`<df-icon>` renders Material Icons by ligature name. Load the font:

```html
<!-- index.html -->
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

`name` values are Material Icons names — `<df-icon name="settings" />`. (Self-hosting is
possible; see DISTRIBUTION §2c.)

### 4. Web fonts
Typography tokens reference **Outfit** (sans), **Merriweather** (serif), **Roboto Mono** (mono):

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Outfit:wght@100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap">
```

Prefer your own brand fonts? Override the token — no rebuild needed:

```css
:root { --font--primitive--sans: 'Inter', sans-serif; }
```

## Quick start

Components are standalone — import what you use:

```ts
import { Component } from '@angular/core';
import { DfButton, DfInput, ToastService } from '@design-foundry/ui';
import { inject } from '@angular/core';

@Component({
  selector: 'app-demo',
  imports: [DfButton, DfInput],
  template: `
    <df-input [(ngModel)]="name" placeholder="Your name">
      <span dfLabel>Name</span>
    </df-input>
    <df-button (clicked)="save()">Save</df-button>
  `,
})
export class Demo {
  private toast = inject(ToastService);
  name = '';
  save() { this.toast.success('Saved'); }
}
```

> Note: buttons emit **`(clicked)`**, not `(click)` — see [API.md](./API.md).

## Theming (light / dark)

Theming is pure CSS — no provider, no service required in the consuming app. The kit ships a
light default and a dark override. Selection:

- **Automatic** — follows `prefers-color-scheme` unless the user opts into light.
- **Explicit** — set `data-theme` on `<html>`:

```ts
document.documentElement.setAttribute('data-theme', 'dark');  // or 'light'
```

Components only reference **semantic** tokens (`--color--semantic--*`), so switching the
attribute re-themes the entire kit automatically. To rebrand, override semantic (or
primitive) tokens in your own `:root` block.

## What's inside

| Tier | Components |
|---|---|
| Primitives | `df-icon`, `df-tag`, `df-status-tag`, `[dfTooltip]` |
| Interactive | `df-button`, `df-icon-button`, `df-toggle`, `df-chip`, `df-checkbox` |
| Navigation | `df-nav-icon`, `df-nav-rail`, `df-nav-divider`, `df-activity-bar`, `df-breadcrumbs` |
| Form inputs | `df-avatar`, `df-input`, `df-inline-input`, `df-option`, `df-select` |
| Data display | `df-list`, `df-list-item` |
| Containers | `df-tab`, `df-tab-list`, `df-card`, `df-menu` (+ `-trigger`/`-item`/`-divider`) |
| Overlays & feedback | `df-toast`, `df-snackbar`, `df-modal` |
| Services | `ToastService`, `SnackbarService`, `DialogService` |

Full per-component inputs/outputs/slots: **[API.md](./API.md)**.

## Forms

`df-input`, `df-inline-input`, `df-checkbox`, `df-toggle`, and `df-select` are
`ControlValueAccessor`s — drop them into template-driven (`[(ngModel)]`) or reactive
(`formControlName`) forms, disabled-state included.

## Compatibility

- **Angular 21+** (standalone APIs, signals, zoneless-friendly).
- **`@angular/cdk` 21+** (overlay/portal).
- Browser-platform rendering (overlay focus management touches `document`; SSR support is on
  the roadmap — see DISTRIBUTION §3).

## Docs in this folder

- **[CONVENTIONS.md](./CONVENTIONS.md)** — the standing rulebook (naming, structure, API, content model, state, tokens, density, a11y).
- **[FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md)** — the control-size/density scale (the alignment contract for a dense tool UI).
- **[FOUNDATIONS-TYPOGRAPHY.md](./FOUNDATIONS-TYPOGRAPHY.md)** — the type scale, the label (UI) ramp vs. reading text, and the dense 11–14 band.
- **[COMPONENTS-ROADMAP.md](./COMPONENTS-ROADMAP.md)** — gap analysis vs. Fluent/AppKit/MUI/Material + what to build next.
- **[BUILDING-A-COMPONENT.md](./BUILDING-A-COMPONENT.md)** — step-by-step runbook for adding a component.
- **[components/](./components/)** — one reference page per component (API, usage, composition, conventions check).
- **[API.md](./API.md)** — condensed component/service API reference (all components, one file).
- **[API-AUDIT.md](./API-AUDIT.md)** / **[API-PROPOSAL.md](./API-PROPOSAL.md)** — consistency review & the agreed conventions-to-lock.
- **[DISTRIBUTION.md](./DISTRIBUTION.md)** — packaging review, gaps, and the pre-publish checklist.
