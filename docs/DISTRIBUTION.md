# Distributing the Design Foundry component kit

A review of `web/src/design-system/` from the angle of: **what would it take to ship this
as a consumable package** that another app — inside or outside the suite — can `npm install`
and use. This is the audit + the plan. The actual packaged repo doesn't exist yet; this
documents what to carry over and what to close first.

> TL;DR — The library itself is in good shape: 31 standalone components + 7 marker
> directives + 3 services, one clean barrel, signal-based APIs, only `@angular/cdk` as a
> real runtime dependency. It is **not yet a package**: no library build, no `package.json`
> of its own, three implicit global dependencies (token CSS, web fonts, Material Icons), no
> tests, and a handful of API-surface and a11y gaps. None are deep; the work is packaging +
> documentation + polish, not a rewrite.

---

## 1. What this folder actually is

A self-contained Angular 21 component kit, currently consumed **in-repo** via the `@ds`
path alias (`tsconfig.json` → `src/design-system/index.ts`). Everything public is
re-exported from [`index.ts`](../index.ts).

| Surface | Count | Notes |
|---|---|---|
| Components | 31 | All `standalone`, `OnPush`, signal inputs/outputs |
| Marker directives | 7 | `dfLabel/dfHint/dfError/dfPrefix/dfSuffix` + `dfModalHeader/dfModalActions` |
| Behavioural directives | 2 | `dfTooltip`, `dfMenuTrigger` |
| Services | 3 | `ToastService`, `SnackbarService`, `DialogService` |
| Token / style layers | 7 SCSS partials | primitive → semantic → composite, + dark theme |

Runtime dependencies (real): **`@angular/core`, `@angular/common`, `@angular/forms`,
`@angular/cdk`**. That's it — no Angular Material, no icon library JS, no utility CSS
framework. `rxjs` is used only transitively (CDK + one `fromEvent` in `dfMenuTrigger`).

Architecture is sound and consistent — see [API.md](./API.md) for the full surface and
[README.md](./README.md) for the consumer-facing getting-started.

---

## 2. The three implicit global dependencies (the #1 distribution risk)

The components render correctly **only because the host app sets up three things globally**.
A consumer who just installs the package and drops in `<df-button>` will get a broken result
until these are wired. They must be documented as install steps (they are, in
[README.md](./README.md)) and ideally made harder to get wrong.

### 2a. The token / style foundation — **required**
Every component's SCSS references semantic CSS custom properties (`--color--semantic--*`,
`--dimension--primitive--*`, `--shadow-*`, `--typography--*`). Those are declared by the
seven partials, pulled in by the app's `styles.scss`:

```scss
@use 'design-system/tokens';
@use 'design-system/semantic-colors';
@use 'design-system/surfaces';
@use 'design-system/borders';
@use 'design-system/shadows';
@use 'design-system/typography';
@use 'design-system/themes';   // must come last — dark overrides the light defaults
```

Without this layer the components render unstyled (every `var(--…)` resolves to nothing).
**Decision needed:** ship these as `.scss` partials (consumer must use Dart Sass) **and/or**
pre-compile a plain `design-foundry.css` for non-Sass consumers. Recommend shipping both:
the SCSS partials for theming/override power, a compiled CSS for drop-in use.

### 2b. Web fonts — **required for correct typography**
The typography tokens hard-reference three families: **Outfit** (sans), **Merriweather**
(serif), **Roboto Mono** (mono). The app loads them via `<link>` in `index.html` (Google
Fonts). A consumer must provide them or text falls back to system fonts.
**Decision needed:** document the `<link>` (zero-config, CDN dependency) vs. self-host vs.
expose the font-family tokens as overridable so a consumer can swap their own brand fonts.
The token indirection already makes the swap a one-line override
(`--font--primitive--sans: 'Inter';`) — worth calling out as a feature.

### 2c. The icon font — **required for every icon**
`df-icon` renders a `<span class="material-icons">{{ name }}</span>` — i.e. classic
**Material Icons** via ligatures, loaded by `<link>` in `index.html`. Implications:
- `name` values are Material Icons ligature names (`"widgets"`, `"close"`, `"mail"`…).
- No icon font ⇒ icon names render as literal text.
- This couples the kit to Google's icon set. **Decision needed:** keep the hard dependency
  (document it), switch to self-hosted Material Symbols, or abstract `df-icon` so a consumer
  can plug their own icon source. At minimum, the icon dependency must be a documented,
  prominent install step.

### 2d. CDK overlay CSS — **required for overlays**
Modal, dialog, select, menu, tooltip, toast, snackbar all attach to CDK overlays. Without
`@angular/cdk/overlay-prebuilt.css` (the app loads it via `angular.json` → `styles`) overlays
render mispositioned / unstyled. Must be a documented install step.

---

## 3. API-surface findings (gaps & inconsistencies)

> These are individual symptoms. The **systemic** problem — that the kit has no shared
> content model (text/icon/collection go in a different way per component), that
> `df-select` can't compose `df-option`, and that `df-list-item` is too thin for real rows —
> is covered in depth in **[API-AUDIT.md](./API-AUDIT.md)**. Read that first; the table below
> is the quick list.

Concrete things to close before calling the public API "done." None are individually large;
collectively (with the audit) they're the main pre-publish work.

| # | Item | Severity | Detail |
|---|---|---|---|
| 1 | `MenuItemVariant` not exported | low (**fixed**) | Public input `DfMenuItem.variant` was typed by an un-exported alias. Added to barrel in this pass. |
| 2 | `DfTooltip` uses legacy `@Input` | medium | `tooltip/tooltip.ts` still uses `@Input('dfTooltip')` / `@Input() dfTooltipPosition` and a mutable class field — the only component not on signal inputs. Works, but off-convention and inconsistent for consumers reading types. Migrate to `input()` like `dfMenuTrigger`. |
| 3 | `df-breadcrumbs` a11y | medium | Renders clickable `<span>`s (per backlog). Should be `<nav aria-label="Breadcrumb"><ol><li><a>` with `aria-current="page"` on the last. Public-facing accessibility for a shipped kit. |
| 4 | Inconsistent disabled-input exposure | low | `df-button`/`df-icon-button` expose `disabled` as an `input()`; `df-checkbox`/`df-toggle`/`df-input`/`df-select` only expose disabled via `setDisabledState` (forms) — no standalone `[disabled]` input for template-driven use without a form. Document or unify. |
| 5 | Event naming: `clicked` vs native | low | Buttons emit `clicked` (not `click`) to avoid clashing with the native event. Fine, but must be documented so consumers don't reach for `(click)`. |
| 6 | `df-select` is single-select only | low (scope) | No multi-select, no typeahead-search, no option groups. Acceptable v1 scope — state it explicitly so it's a known boundary, not a surprise. |
| 7 | Two overlapping "label" primitives | low | `tag` / `chip` / `status-tag` overlap; `toast` / `snackbar` overlap. Needs usage guidance (in API.md) so consumers pick correctly. |

SSR note: `dialog.service.ts` and `modal.ts` touch `document` directly (focus management).
This is fine for the SPA-only Hub app, but a **distributed** library may land in an SSR/SSG
host. Guard direct DOM access (`isPlatformBrowser` / inject `DOCUMENT`) before shipping
broadly, or document "browser-platform only."

---

## 4. What's missing to be a package

### 4a. A library build (can't live in this app project)
The folder currently compiles as part of the `web` application. To publish it needs its own
Angular **library** project built with **ng-packagr** (Angular Package Format output: FESM,
type definitions, `package.json` with `exports`). This is the "another repo" the task defers.
Sketch:

```
design-foundry-ui/                # future repo (or an Angular workspace library project)
├── ng-package.json               # ng-packagr entry → public-api
├── package.json                  # name, version, peerDependencies, exports
├── src/
│   ├── public-api.ts             # ← today's index.ts, verbatim
│   ├── lib/                      # ← today's component folders, verbatim
│   └── styles/                   # ← the 7 SCSS partials, shipped as assets
└── README.md                     # ← docs/README.md
```

Good news: the source moves **as-is**. `index.ts` becomes `public-api.ts`; the `@ds` alias
becomes the package name. Nothing in the components assumes the app.

### 4b. A `package.json` with the right `peerDependencies`
Angular framework packages must be **peer** deps (never bundled), to avoid duplicate-Angular
breakage. Draft:

```jsonc
{
  "name": "@design-foundry/ui",
  "version": "0.1.0",
  "peerDependencies": {
    "@angular/core": ">=21.0.0 <22.0.0",
    "@angular/common": ">=21.0.0 <22.0.0",
    "@angular/forms": ">=21.0.0 <22.0.0",
    "@angular/cdk": ">=21.0.0 <22.0.0"
  },
  "dependencies": { "tslib": "^2.3.0" },
  "sideEffects": false,
  "exports": {
    ".": { "types": "./index.d.ts", "default": "./fesm2022/design-foundry-ui.mjs" },
    "./styles": { "sass": "./styles/_index.scss" },
    "./styles.css": "./styles/design-foundry.css"
  }
}
```

### 4c. Versioning, license, changelog, metadata
- **License** — none present. Pick one (MIT for broad use; proprietary if suite-internal).
- **CHANGELOG.md** + SemVer discipline — the kit will have breaking changes; consumers need
  a contract. Note the Angular major is effectively part of the version (peer range above).
- **`README.md`** — done here ([README.md](./README.md)); becomes the npm landing page.
- Author/repo/keywords fields, `.npmignore` (ship `dist`, not source).

### 4d. Tests — biggest quality gap
No `.spec` files exist (confirmed — only `src/app/app.spec.ts` at app level). For a package
others depend on, this is the largest risk. Minimum bar before publish (runner is **vitest**,
already in `web/`):
- render + input/projection smoke test per component;
- CVA round-trip for `checkbox` / `toggle` / `input` / `select` / `inline-input`;
- a11y assertions (roles, `aria-*`, keyboard nav) for `checkbox` / `toggle` / `select` /
  `tab-list` / `modal`;
- service behaviour: toast stack add/dismiss/auto-timeout, snackbar replace-current,
  dialog `confirm()` resolution + focus return.

### 4e. Documentation surface
- [API.md](./API.md) — full per-component reference (this pass). The integration contract.
- A **live gallery** is the natural next step: the repo already has a dev-only
  `/design-system` showcase route — promoting that to a published Storybook or a deployed
  demo gives consumers a "try it" surface. Decision: Storybook vs. keep the bespoke showcase.

---

## 5. Pre-publish checklist

Copy this into the future package repo's first issue.

**Blocking (must do before a real publish):**
- [ ] Stand up the ng-packagr library project; APF build green (`index.ts` → `public-api.ts`).
- [ ] `package.json` with Angular/CDK as **peerDependencies**, `tslib` dep, `sideEffects:false`.
- [ ] Ship the token layer: SCSS partials as assets **and** a compiled `design-foundry.css`.
- [ ] Choose & add a LICENSE.
- [ ] Resolve the icon-font story (document hard dep, self-host, or abstract `df-icon`).
- [ ] Resolve the web-font story (document, self-host, or document the token override path).
- [ ] Document the four required global setup steps prominently (tokens, fonts, icons, CDK CSS).
- [ ] Guard or document direct `document` access for SSR safety.

**Quality (should do):**
- [ ] Component + CVA + a11y + service tests (vitest).
- [ ] Migrate `dfTooltip` off legacy `@Input` to `input()`.
- [ ] Fix `df-breadcrumbs` semantics (`nav>ol>li>a`, `aria-current`).
- [ ] CHANGELOG + SemVer + peer-range policy doc.
- [ ] Decide on a published gallery (Storybook or deployed showcase).

**Polish (nice-to-have — from the existing backlog):**
- [ ] `df-avatar` image-error → initials fallback.
- [ ] `df-button` `size` scale (parity with `df-icon-button`).
- [ ] `df-menu` close via `transitionend` instead of `setTimeout(120)`.
- [ ] Token hygiene: reconcile duplicate `spacing-*` / `sizing-*` scales with a usage rule.
- [ ] Usage guidance for `tag`/`chip`/`status-tag` and `toast`/`snackbar` overlaps.

---

## 6. Alignment note (suite-specific)

Because Hub itself *emits* design systems, this kit is also the natural **dogfood target**:
its primitive→semantic token tiers should round-trip through Hub's own token model (OKLCH
ramps → `ColorToken`, px scales → `DimensionToken`, the typography matrix → `TypographyToken`).
Worth keeping in view when deciding the distribution format — the "package" and the
"Hub-published version" may eventually be the same artifact.
