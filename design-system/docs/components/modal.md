# `DfModal` — `<df-modal>`

> A declarative dialog toggled by a two-way `open`. The **content-model exemplar for composite
> overlays**: header/body/actions with input fallbacks. For imperative/awaitable dialogs use
> [`DialogService`](./dialog-service.md).

**Tier:** Overlay & feedback
**Selector:** `df-modal`
**Source:** [`../../modal/modal.ts`](../../modal/modal.ts)

## API

| Member | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `open` | **model** | `boolean` | `false` | Two-way `[(open)]` |
| `title` | input | `string` | `''` | Header fallback (overridden by `[dfModalHeader]`) |
| `subtitle` | input | `string` | `''` | |
| `variant` | input | `ModalVariant` | `'informative'` | Drives default footer + destructive styling |
| `confirmLabel` | input | `string` | `'Confirm'` | |
| `cancelLabel` | input | `string` | `'Cancel'` | |
| `closed` | output | `void` | — | X / Escape / backdrop |
| `confirmed` | output | `void` | — | Default confirm button |
| `cancelled` | output | `void` | — | Default cancel button |

**Content slots:** `[dfModalHeader]` (overrides title/subtitle) · default = body ·
`[dfModalActions]` (overrides the variant footer).
**Exported types:** `ModalVariant = 'informative' \| 'confirmation' \| 'interactive' \| 'destructive'`

## Usage

```html
<df-modal [(open)]="open" title="Delete project?" variant="destructive"
          (confirmed)="remove()" (cancelled)="open.set(false)">
  This can't be undone.
</df-modal>

<!-- custom header + actions -->
<df-modal [(open)]="open">
  <div dfModalHeader><h2 class="typography-heading-lg">Custom</h2></div>
  <p>Body…</p>
  <div dfModalActions>
    <df-button variant="ghost" (clicked)="open.set(false)">Close</df-button>
  </div>
</df-modal>
```

## Composition

- Renders into a centered CDK overlay with scrim + scroll-block; uses the
  `dfModalHeader`/`dfModalActions` markers (detected via `contentChild`) with input-driven
  fallbacks — the **projection-overrides-shorthand** pattern at composite scale (CONVENTIONS §5).
- Footer shows automatically when actions are projected or `variant !== 'informative'`.

## States & accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → title; **focus trap** (auto-focus
  first focusable, Tab/Shift-Tab cycle, return focus on close); Escape + backdrop dismiss;
  scroll blocked. Strong reference implementation.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ✅ | Header/actions projection with input fallback (exemplar) |
| §4 two-way state | ✅ | `open` is a `model()` |
| §4 output naming | ⚠️ | `closed` → proposal prefers `dismissed`; `confirmed`/`cancelled` keep |
| §7 a11y | ✅ | Full focus-trap dialog semantics |
| §8 tokens | ✅ | |

## Notes / TODO

- Align `closed` → `dismissed` if the overlay naming sweep lands ([API-PROPOSAL §Rule 5](../API-PROPOSAL.md)).
- `df-modal` and `DialogService` share `modal.scss` — keep them in sync (or extract a shared
  dialog shell).
