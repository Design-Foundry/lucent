# Design Foundry UI — Component API reference

The complete public surface of the kit: every component, directive, and service exported
from [`index.ts`](../index.ts), with selectors, inputs, outputs, two-way models, content
slots, and emitted types.

**Conventions used below**
- **Input** = one-way signal `input()`. **Model** = two-way `model()` (bind with `[(x)]`).
- **Output** = `output()`; the listed name is the event you bind with `(name)`.
- Types in `code` are exported from the barrel unless noted *(internal)*.
- Boolean inputs use Angular's `booleanAttribute` coercion — `<df-button loading>` works.
- Buttons emit **`clicked`**, not `click` (avoids clashing with the native DOM event).

Import everything from the single barrel:

```ts
import { DfButton, DfModal, ToastService, ButtonVariant } from '@ds';
//                                                   ↑ in a published package: '@design-foundry/ui'
```

Components are standalone — add them to a component's `imports: []`. Services are
`providedIn: 'root'` — just `inject()` them.

---

## Foundations

**`ControlSize`** — the shared density scale used by interactive controls (`button`, `input`,
`select`, `chip`, `checkbox`; default `'md'`):

```ts
type ControlSize = 'xs' | 'sm' | 'md' | 'lg';   // 24 · 28 · 32 · 40 px control height
```

Same `size` ⇒ same height, so controls pair side-by-side. Full spec:
[FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md). *(Older controls — `icon-button`, `toggle`,
`tab`, `avatar` — still use their own size unions; migration tracked in the roadmap.)*

**`Tone`** — action intent for interactive controls, orthogonal to visual `variant` and to the
`info/success/warning/error` *status* scale:

```ts
type Tone = 'default' | 'danger';   // 'danger' = destructive action (red, intensifies on hover)
```

On `df-list-item` today (the reference); `button`/`menu-item` still fold danger into `variant`
and `modal`/`dialog` say `destructive` — both to migrate. See [CONVENTIONS §6](./CONVENTIONS.md).

---

## Tier 1 — Primitives

### `DfIcon` — `<df-icon>`
Renders a Material Icons glyph. Decorative by default (`aria-hidden`); set `ariaLabel` to
make it meaningful. Requires the Material Icons font (see DISTRIBUTION §2c).

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `name` | input | `string` | `'widgets'` | Material Icons ligature name |
| `size` | input | `IconSize` | `'md'` | `'xs'｜'sm'｜'md'｜'lg'｜'xl'` |
| `ariaLabel` | input | `string` | `''` | When set → `role="img"` + label; else `aria-hidden` |

`type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'`

### `DfTag` — `<df-tag>`
Static, non-interactive label. Content-projected. No inputs/outputs — style-only via
projected text.

### `DfStatusTag` — `<df-status-tag>`
Status pill with a semantic color.

| Member | Kind | Type | Default |
|---|---|---|---|
| `variant` | input | `StatusTagVariant` | `'success'` |
| `label` | input | `string` | `''` |

`type StatusTagVariant = 'success' | 'neutral' | 'warning' | 'error'`

### `DfTooltip` — `[dfTooltip]` (directive)
Accessible tooltip on any focusable trigger. Shows on hover + keyboard focus, sets
`aria-describedby`, dismisses on Escape. *(Currently legacy `@Input` — see DISTRIBUTION §3.2.)*

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `dfTooltip` | input | `string` | `''` | The tooltip text (the directive's value) |
| `dfTooltipPosition` | input | `TooltipPosition` | `'top'` | `'top'｜'bottom'｜'left'｜'right'` |

```html
<button [dfTooltip]="'Delete'" dfTooltipPosition="bottom">…</button>
```

`type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'`
*(`DfTooltipBubble` is internal — rendered into the overlay by the directive, not used directly.)*

---

## Tier 2 — Interactive

### `DfButton` — `<df-button>`
| Member | Kind | Type | Default |
|---|---|---|---|
| `variant` | input | `ButtonVariant` | `'primary'` |
| `tone` | input | `ButtonTone` | `'neutral'` |
| `size` | input | `ControlSize` | `'md'` |
| `loading` | input | `boolean` | `false` |
| `disabled` | input | `boolean` | `false` |
| `type` | input | `'button'｜'submit'｜'reset'` | `'button'` |
| `clicked` | output | `MouseEvent` | — |

`type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger'` (plus deprecated `'ghost'`, an alias of `text`, and `'on-glass'`)
`type ButtonTone = 'neutral' | 'danger'`
Content (label) is projected: `<df-button variant="danger">Delete</df-button>`.

### `DfIconButton` — `<df-icon-button>`
Icon-only button (the *interactive* counterpart to decorative `df-icon`).

| Member | Kind | Type | Default |
|---|---|---|---|
| `icon` | input | `string` | `''` |
| `variant` | input | `ButtonVariant` | `'primary'` |
| `size` | input | `IconButtonSize` | `'md'` |
| `loading` | input | `boolean` | `false` |
| `disabled` | input | `boolean` | `false` |
| `type` | input | `'button'｜'submit'｜'reset'` | `'button'` |
| `ariaLabel` | input | `string` | `''` |
| `clicked` | output | `MouseEvent` | — |

`type IconButtonSize = 'sm' | 'md' | 'lg'` — always pass `ariaLabel` (icon-only ⇒ no text).

### `DfToggle` — `<df-toggle>`  · *form control (CVA)*
Switch. Implements `ControlValueAccessor` — use with `[(ngModel)]` / `formControlName`.
`role="switch"`, keyboard: Space/Enter.

| Member | Kind | Type | Default |
|---|---|---|---|
| `size` | input | `ToggleSize` | `'md'` |
| `label` | input | `string` | `''` (→ `aria-label`) |

`type ToggleSize = 'md' | 'sm'` · disabled state comes via forms (`setDisabledState`).

### `DfChip` — `<df-chip>`
| Member | Kind | Type | Default |
|---|---|---|---|
| `type` | input | `ChipType` | `'default'` |
| `size` | input | `ControlSize` | `'md'` |
| `label` | input | `string` | `''` |
| `closed` | output | `void` | — (emitted by the remove affordance) |

`type ChipType = 'tag' | 'default' | 'active' | 'action'`

### `DfCheckbox` — `<df-checkbox>`  · *form control (CVA)*
`role="checkbox"`, supports indeterminate, keyboard Space.

| Member | Kind | Type | Default |
|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` |
| `label` | input | `string` | `''` (→ `aria-label`) |
| `indeterminate` | input | `boolean` | `false` |

Value (`boolean`) flows through forms; `aria-checked` becomes `"mixed"` when indeterminate.

---

## Tier 3 — Navigation

### `DfNavIcon` — `<df-nav-icon>`
| Member | Kind | Type | Default |
|---|---|---|---|
| `name` | input | `string` | `'widgets'` |
| `active` | input | `boolean` | `false` |
| `disabled` | input | `boolean` | `false` |
| `ariaLabel` | input | `string` | `''` |

### `DfNavRail` — `<df-nav-rail>`
Vertical rail container. Content-projected, no inputs. Compose with `DfNavIcon` / `DfNavDivider`.

### `DfNavDivider` — `<df-nav-divider>`
Separator for the nav rail. No API.

### `DfActivityBar` — `<df-activity-bar>`
Top-level activity bar container. Content-projected, no inputs.

### `DfBreadcrumbs` — `<df-breadcrumbs>`
| Member | Kind | Type | Default |
|---|---|---|---|
| `items` | input | `BreadcrumbItem[]` | `[]` |
| `itemClick` | output | `BreadcrumbItem` | — |

```ts
interface BreadcrumbItem { label: string; path?: string; data?: unknown; }
```
*(a11y redesign pending — see DISTRIBUTION §3.3.)*

---

## Tier 4 — Form inputs

### `DfAvatar` — `<df-avatar>`
| Member | Kind | Type | Default |
|---|---|---|---|
| `src` | input | `string` | `''` |
| `name` | input | `string` | `''` (initials fallback / label) |
| `tenant` | input | `string` | `''` |
| `scale` | input | `AvatarScale` | `'md'` |
| `variant` | input | `AvatarVariant` | `'trailing'` |

`type AvatarScale = 'xs' | 'sm' | 'md' | 'lg'` · `type AvatarVariant = 'trailing' | 'leading' | 'none'`

### `DfInput` — `<df-input>`  · *form control (CVA)*
Text field with projected label/hint/error slots. Implements `ControlValueAccessor`.

| Member | Kind | Type | Default |
|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` |
| `placeholder` | input | `string` | `''` |
| `type` | input | `string` | `'text'` |
| `readonly` | input | `boolean` | `false` |
| `clearable` | input | `boolean` | `false` — shows a clear button when filled |
| `cleared` | output | `void` | — emitted when cleared |

**Content slots:** `[dfLabel]`, `[dfHint]`, `[dfError]` (presence of `dfError` drives the
error state and `aria-describedby`). Disabled via forms.

```html
<df-input [(ngModel)]="email" placeholder="you@example.com" clearable>
  <span dfLabel>Email</span>
  <span dfHint>We never share it.</span>
  @if (invalid) { <span dfError>Enter a valid email.</span> }
</df-input>
```

### `DfInlineInput` — `<df-inline-input>`  · *form control (CVA)*
Borderless inline-editable text (e.g. rename in place). Inherits a typography class.

| Member | Kind | Type | Default |
|---|---|---|---|
| `typography` | input | `string` | `''` — a `.typography-*` class name applied to the field |
| `placeholder` | input | `string` | `''` |

### `DfOption` — `<df-option>`
A single option row (used by `DfSelect`, or standalone in custom listboxes).

| Member | Kind | Type | Default |
|---|---|---|---|
| `label` | input | `string` | `''` |
| `value` | input | `unknown` | `''` |
| `selected` | input | `boolean` | `false` |
| `active` | input | `boolean` | `false` (keyboard-highlighted) |
| `disabled` | input | `boolean` | `false` |
| `optionSelect` | output | `unknown` | — emits the option's `value` |

### `DfSelect` — `<df-select>`  · *form control (CVA)*
Single-select listbox on a CDK overlay. Full keyboard support (Arrow/Home/End/Enter/Esc/Tab),
`aria-activedescendant`, projected label/hint/error slots.

| Member | Kind | Type | Default |
|---|---|---|---|
| `size` | input | `ControlSize` | `'md'` |
| `placeholder` | input | `string` | `'Select an option'` |
| `options` | input | `SelectOption[]` | `[]` |
| `selectionChange` | output | `unknown` | — emits selected `value` |

```ts
interface SelectOption { label: string; value: unknown; }
```
**Content slots:** `[dfLabel]`, `[dfHint]`, `[dfError]`. Value flows through forms. Single-select only.

---

## Tier 5 — Data display

### `DfListItem<T>` — `<df-list-item>`
The kit's **reference row primitive** — the worked example of the API conventions
(API-PROPOSAL §Rule 4). Generic over the row's value type `T`.

| Member | Kind | Type | Default |
|---|---|---|---|
| `value` | input | `T \| undefined` | `undefined` |
| `label` | input | `string` | `''` (shorthand; projected content overrides) |
| `icon` | input | `string` | `''` (leading shorthand; `[dfLeading]` overrides) |
| `selected` | input | `boolean` | `false` (chosen state) |
| `disabled` | input | `boolean` | `false` |
| `interactive` | input | `boolean` | `true` (adds `role="button"` + keyboard) |
| `tone` | input | `Tone` | `'default'` (`'danger'` = destructive row) |
| `activated` | output | `T \| undefined` | — (fires on click / Enter / Space) |

**Content slots:** default slot = primary text · `[dfLeading]` · `[dfSupporting]` (second line) · `[dfTrailing]`.

```html
<df-list-item [value]="m.id" [selected]="m.id === activeId" (activated)="open($event)">
  <df-avatar dfLeading [name]="m.name" />
  {{ m.name }}
  <span dfSupporting>{{ m.email }}</span>
  <df-icon-button dfTrailing icon="more_vert" ariaLabel="Actions" />
</df-list-item>
```

> Selection renders visually on the base row; semantic `aria-selected` is added by listbox
> specializations (`df-option`). For a single-select nav list, set `aria-current` at the usage site.

### `DfList` — `<df-list>`
Content-projected list container (`<ng-content/>`). No API; compose with `DfListItem`.

---

## Tier 6 — Containers

### `DfTab` — `<df-tab>`
A single tab. Usually managed by `DfTabList` (which sets `scale`/`active` via an effect), but
`scale` and `active` are two-way models so it can be driven directly.

| Member | Kind | Type | Default |
|---|---|---|---|
| `label` | input | `string` | `''` |
| `icon` | input | `string` | `''` |
| `disabled` | input | `boolean` | `false` |
| `value` | input | `string` | `''` (identity used by the list) |
| `scale` | **model** | `TabScale` | `'md'` |
| `active` | **model** | `boolean` | `false` |
| `tabClick` | output | `void` | — |

`type TabScale = 'lg' | 'md' | 'sm' | 'xs'`

### `DfTabList` — `<df-tab-list>`
Owns a set of projected `DfTab`s: distributes `scale`, marks the active one, and handles
roving keyboard nav (Arrow/Home/End). `role="tablist"`.

| Member | Kind | Type | Default |
|---|---|---|---|
| `scale` | input | `TabScale` | `'md'` |
| `activeTab` | input | `string` | `''` (matches a tab's `value`) |
| `tabChange` | output | `string` | — emits the activated tab's `value` |

```html
<df-tab-list [activeTab]="tab()" (tabChange)="tab.set($event)">
  <df-tab value="overview" label="Overview" />
  <df-tab value="settings" label="Settings" />
</df-tab-list>
```

### `DfCard` — `<df-card>`
Content-projected surface container (`<ng-content/>`). No API.

### `DfMenu` / `DfMenuTrigger` / `DfMenuItem` / `DfMenuDivider`
Dropdown menu. `DfMenuTrigger` is a directive that takes a `<ng-template>` of menu content
and renders it into a CDK overlay positioned against the host; closes on outside-click /
Escape / item-click.

**`[dfMenuTrigger]`** (directive on the trigger element)
| Member | Kind | Type | Default |
|---|---|---|---|
| `dfMenuTrigger` | input *(required)* | `TemplateRef<void>` | — the menu template |
| `dfMenuPosition` | input | `'bottom-end'｜'bottom-start'` | `'bottom-end'` |

**`<df-menu>`** — the menu surface container. No API.
**`<df-menu-item>`**
| Member | Kind | Type | Default |
|---|---|---|---|
| `label` | input | `string` | `''` |
| `icon` | input | `string` | `''` |
| `active` | input | `boolean` | `false` |
| `variant` | input | `MenuItemVariant` | `'default'` |

`type MenuItemVariant = 'default' | 'danger'`
**`<df-menu-divider>`** — separator, no API.

```html
<button [dfMenuTrigger]="menu">Actions ▾</button>
<ng-template #menu>
  <df-menu>
    <df-menu-item icon="edit" label="Rename" />
    <df-menu-divider />
    <df-menu-item icon="delete" label="Delete" variant="danger" />
  </df-menu>
</ng-template>
```

---

## Tier 7 — Overlays & feedback (declarative)

### `DfToast` — `<df-toast>`
A single toast card. Usually created via `ToastService`, but usable directly.

| Member | Kind | Type | Default |
|---|---|---|---|
| `title` | input | `string` | `''` |
| `message` | input | `string` | `''` |
| `variant` | input | `ToastVariant` | `'informative'` |
| `closable` | input | `boolean` | `true` |
| `closed` | output | `void` | — |

`type ToastVariant = 'informative' | 'success' | 'warning' | 'error'`

### `DfSnackbar` — `<df-snackbar>`
A single snackbar. Usually created via `SnackbarService`.

| Member | Kind | Type | Default |
|---|---|---|---|
| `message` | input | `string` | `''` |
| `icon` | input | `string` | `'widgets'` |
| `showIcon` | input | `boolean` | `true` |
| `actionLabel` | input | `string` | `''` |
| `action` | output | `void` | — emitted by the action button |

### `DfModal` — `<df-modal>`
Declarative dialog. Toggle with two-way `open`; renders into a centered CDK overlay with
scrim, scroll-block, focus trap (auto-capture + return-focus), Escape + backdrop dismissal,
`role="dialog"` / `aria-modal`.

| Member | Kind | Type | Default |
|---|---|---|---|
| `open` | **model** | `boolean` | `false` |
| `title` | input | `string` | `''` |
| `subtitle` | input | `string` | `''` |
| `variant` | input | `ModalVariant` | `'informative'` |
| `confirmLabel` | input | `string` | `'Confirm'` |
| `cancelLabel` | input | `string` | `'Cancel'` |
| `closed` | output | `void` | — dismissed (X / Esc / backdrop) |
| `confirmed` | output | `void` | — confirm button |
| `cancelled` | output | `void` | — cancel button |

`type ModalVariant = 'informative' | 'confirmation' | 'interactive' | 'destructive'`

**Content slots:** `[dfModalHeader]` (overrides `title`/`subtitle`), default slot (body),
`[dfModalActions]` (overrides the variant-driven footer). The footer renders for any variant
except `informative`, or whenever `dfModalActions` is provided.

```html
<df-modal [(open)]="open" title="Delete project?" variant="destructive"
          confirmLabel="Delete" (confirmed)="remove()">
  <p>This can't be undone.</p>
</df-modal>
```

---

## Marker directives (content projection)

Behaviourless selectors host components use to target and detect projected content
(Material's `matPrefix`/`matSuffix` pattern). Apply to projected elements.

| Directive | Used by | Purpose |
|---|---|---|
| `[dfLabel]` | input, select | Field label |
| `[dfHint]` | input, select | Helper text below the field |
| `[dfError]` | input, select | Error text; its **presence** drives the error state |
| `[dfPrefix]` | (inputs) | Leading adornment *(legacy — being replaced by `dfLeading`)* |
| `[dfSuffix]` | (inputs) | Trailing adornment *(legacy — being replaced by `dfTrailing`)* |
| `[dfLeading]` | list-item | Leading adornment (icon/avatar); overrides the `icon` shorthand |
| `[dfTrailing]` | list-item | Trailing region (meta text / actions / chevron) |
| `[dfSupporting]` | list-item | Secondary (second-line) text |
| `[dfModalHeader]` | modal | Custom header (overrides `title`/`subtitle`) |
| `[dfModalActions]` | modal | Custom footer actions |

> `dfLeading` / `dfTrailing` / `dfSupporting` are the standardized adornment vocabulary
> (API-PROPOSAL §Rule 2/4). `df-list-item` is the reference implementation; other row and
> field components adopt these names — and retire `dfPrefix`/`dfSuffix` — as they are refit.

---

## Services (imperative overlays)

All three are `providedIn: 'root'` — `inject()` and call. They self-host a CDK overlay on
first use; no module/provider setup required beyond the global CDK overlay CSS.

### `ToastService`
Stacked transient notifications, top-right.

```ts
show(options: ToastOptions): number          // returns a toast id
success(message, options?): number
info(message, options?): number
warning(message, options?): number
error(message, options?): number
dismiss(id: number): void
```
```ts
interface ToastOptions {
  title?: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;   // ms; 0 = until dismissed; default 5000
}
```

### `SnackbarService`
A single snackbar, bottom-center; opening a new one replaces the current.

```ts
open(options: SnackbarOptions): void
action(): void    // fires onAction then dismisses
dismiss(): void
```
```ts
interface SnackbarOptions {
  message: string;
  icon?: string;
  showIcon?: boolean;
  actionLabel?: string;
  duration?: number;      // ms; 0 = until dismissed; default 5000
  onAction?: () => void;
}
```

### `DialogService`
Opens an arbitrary component as a modal dialog, or a built-in confirm.

```ts
open<R, D>(component: ComponentType<unknown>, config?: { data?: D }): DialogRef<R>
confirm(options: ConfirmOptions): Promise<boolean>   // true if confirmed
```
- Inside the opened component, read the payload with `inject(DIALOG_DATA)` and the handle
  with `inject(DialogRef)`; close with `ref.close(result)` and `await ref.closed`.
- The overlay provides scrim, scroll-block, focus trap, Escape + backdrop dismissal.

```ts
class DialogRef<R = unknown> {
  readonly closed: Promise<R | undefined>;
  close(result?: R): void;
}
interface ConfirmOptions {
  title?: string; message?: string;
  confirmLabel?: string; cancelLabel?: string;
  variant?: 'confirmation' | 'destructive';
}
```

```ts
// Open a custom component as a dialog:
const ref = dialog.open<EditResult, Project>(EditProjectDialog, { data: project });
const result = await ref.closed;

// Or a quick confirm:
if (await dialog.confirm({ title: 'Sign out?', variant: 'destructive' })) signOut();
```

Exported token/handle: `DIALOG_DATA`, `DialogRef`, `DialogService`.

---

## Forms integration summary

These components are `ControlValueAccessor`s — they work with template-driven (`[(ngModel)]`)
and reactive (`formControlName`/`formControl`) forms, including `setDisabledState`:

`DfInput` · `DfInlineInput` · `DfCheckbox` · `DfToggle` · `DfSelect`

Their value types: input/inline-input → `string`, checkbox/toggle → `boolean`,
select → the chosen option's `value` (`unknown`).
