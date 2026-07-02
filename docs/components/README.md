# Component reference

One page per component. Each documents the API, usage, composition, a11y, and — crucially — a
**Conventions check** that logs where the component drifts from [CONVENTIONS.md](../CONVENTIONS.md).
Reading these side by side is how we surface inconsistencies concretely.

- New component? Follow [BUILDING-A-COMPONENT.md](../BUILDING-A-COMPONENT.md) and copy
  [`_TEMPLATE.md`](./_TEMPLATE.md).
- The condensed API tables for the whole kit live in [API.md](../API.md); these pages are the
  long form.

Status legend: ✅ documented · 🟡 stub · ⬜ not started. The **Conventions** column flags the
biggest known drift (see each page's Conventions-check table for the full list).

## Primitives
| Component | Doc | Conventions |
|---|---|---|
| `df-icon` | ✅ [icon.md](./icon.md) | ✅ on-convention |
| `df-tag` | ✅ [tag.md](./tag.md) | ⚠️ no `label` shorthand |
| `df-status-tag` | ✅ [status-tag.md](./status-tag.md) | ❌ no projection; colour-only a11y |
| `lucent-badge` | ✅ [badge.md](./badge.md) | ✅ on-convention |
| `[dfTooltip]` | ✅ [tooltip.md](./tooltip.md) | ❌ only component on legacy `@Input` |

## Interactive
| Component | Doc | Conventions |
|---|---|---|
| `df-button` | ✅ [button.md](./button.md) | ⚠️ legacy `dfPrefix`/`dfSuffix`; no `label` shorthand |
| `df-icon-button` | ✅ [icon-button.md](./icon-button.md) | ⚠️ `ariaLabel` not enforced |
| `df-toggle` | ✅ [toggle.md](./toggle.md) | ❌ no standalone `[disabled]` |
| `df-chip` | ✅ [chip.md](./chip.md) | ❌ `type` conflates 3 axes; no projection |
| `df-checkbox` | ✅ [checkbox.md](./checkbox.md) | ❌ no standalone `[disabled]` |
| `lucent-radio` | ✅ [radio.md](./radio.md) | ✅ group CVA; ⚠️ arrow-roving TODO (JS kits) |

## Navigation
| Component | Doc | Conventions |
|---|---|---|
| `df-nav-icon` | ✅ [nav-icon.md](./nav-icon.md) | ❌ `name` (not `icon`), `active` (not `selected`); no keyboard |
| `df-nav-rail` | ✅ [nav-rail.md](./nav-rail.md) | ⚠️ no selection coordination / landmark |
| `df-nav-divider` | ✅ [nav-divider.md](./nav-divider.md) | ⚠️ duplicates `menu-divider`; no `role` |
| `df-activity-bar` | ✅ [activity-bar.md](./activity-bar.md) | ⚠️ no role |
| `df-breadcrumbs` | ✅ [breadcrumbs.md](./breadcrumbs.md) | ❌ no nav/ol/anchor/`aria-current`; `itemClick` |

## Form inputs
| Component | Doc | Conventions |
|---|---|---|
| `df-avatar` | ✅ [avatar.md](./avatar.md) | ⚠️ initials have no accessible name |
| `df-input` | ✅ [input.md](./input.md) | ✅ CVA reference; ⚠️ legacy adornment slots |
| `df-inline-input` | ✅ [inline-input.md](./inline-input.md) | ⚠️ no labelling; forms-only disabled |
| `lucent-textarea` | ✅ [textarea.md](./textarea.md) | ✅ mirrors text-input (CVA, states) |
| `df-option` | ✅ [option.md](./option.md) | ❌ not composable with `df-select`; `value: unknown` |
| `df-select` | ✅ [select.md](./select.md) | ❌ `SelectOption` weaker than `df-option`; untyped |

## Data display
| Component | Doc | Conventions |
|---|---|---|
| `df-list-item` | ✅ [list-item.md](./list-item.md) | ✅ **reference row primitive** |
| `df-list` | ✅ [list.md](./list.md) | ⚠️ no roving keyboard / selection model |

## Containers
| Component | Doc | Conventions |
|---|---|---|
| `df-tab` | ✅ [tab.md](./tab.md) | ✅ content-model exemplar; ❌ `active`/`tabClick` naming |
| `df-tab-list` | ✅ [tab-list.md](./tab-list.md) | ✅ projection-collection exemplar; ⚠️ not `[(value)]` |
| `df-card` | ✅ [card.md](./card.md) | ✅ on-convention |
| `df-menu` | ✅ [menu.md](./menu.md) | ⚠️ no `role="menu"` / roving |
| `df-menu-trigger` | ✅ [menu-trigger.md](./menu-trigger.md) | ⚠️ no `aria-haspopup`/`expanded` |
| `df-menu-item` | ✅ [menu-item.md](./menu-item.md) | ❌ dead `surface-subtle` hover; no projection |
| `df-menu-divider` | ✅ [menu-divider.md](./menu-divider.md) | ⚠️ duplicates `nav-divider` |

## Feedback
| Component | Doc | Conventions |
|---|---|---|
| `lucent-spinner` | ✅ [spinner.md](./spinner.md) | ✅ on-convention (closes the spinner gap) |
| `lucent-skeleton` | ✅ [skeleton.md](./skeleton.md) | ✅ on-convention |
| `lucent-progress` | ✅ [progress.md](./progress.md) | ✅ on-convention |

## Overlays & feedback
| Component | Doc | Conventions |
|---|---|---|
| `df-toast` | ✅ [toast.md](./toast.md) | ⚠️ text-only; `closed` vs `dismissed` |
| `df-snackbar` | ✅ [snackbar.md](./snackbar.md) | ❌ `action` naming; no live region |
| `df-modal` | ✅ [modal.md](./modal.md) | ✅ composite content-model exemplar |

## Services
| Service | Doc | Conventions |
|---|---|---|
| `ToastService` | ✅ [toast-service.md](./toast-service.md) | ✅ on-convention |
| `SnackbarService` | ✅ [snackbar-service.md](./snackbar-service.md) | ⚠️ no announce (component gap) |
| `DialogService` | ✅ [dialog-service.md](./dialog-service.md) | ✅ typed + a11y reference |

---

## Cross-cutting inconsistencies (rolled up from the pages above)

The per-component drift clusters into a handful of systemic issues — full analysis in
[API-AUDIT.md](../API-AUDIT.md), fixes in [API-PROPOSAL.md](../API-PROPOSAL.md):

- **No shared content model** — projection (`button`/`tag`/`tab`/`modal`) vs. `label`-only
  (`chip`/`status-tag`/`option`/`menu-item`/`list`-rows). Most can't hold rich content.
- **Adornment naming split** — `icon` (`tab`/`menu-item`/`icon-button`/`snackbar`) vs. `name`
  (`nav-icon`) vs. `dfPrefix`/`dfSuffix` (`button`/`input`) vs. the new `dfLeading`/`dfTrailing`
  (`list-item`).
- **Selection vocab** — `selected` (`option`) vs. `active`-means-chosen (`tab`/`nav-icon`/old `list-item`).
- **`disabled`** — input (most) vs. forms-only (`checkbox`/`toggle`/`input`/`select`).
- **Output naming** — `clicked`/`closed`/`cleared`/`confirmed`/`cancelled` vs. `optionSelect`/
  `tabClick`/`itemClick`/`tabChange`/`selectionChange`/`action`.
- **Danger/error intent named three ways** — `danger` (button/menu-item) vs. `destructive`
  (modal/dialog) vs. `error` (toast/status-tag/validation). Convention: a shared `tone` axis
  (`default`/`danger`) for action intent, separate from the `info/success/warning/error` status
  scale. `list-item` carries `tone` (the reference); `button`/`menu-item`/`modal` to migrate.
- **Untyped values** — `unknown` in `option`/`select`/`breadcrumbs` vs. generics in
  `list-item`/`DialogService`.
- **Collection composability** — `df-select` can't compose `df-option`.
- **Three near-identical rows** — `list-item` / `option` / `menu-item`.
- **Dead token** — `--color--semantic--surface-subtle` (used by `menu-item`) is undefined.
- **Duplicated dividers** — `nav-divider` + `menu-divider`.
- **a11y gaps** — `breadcrumbs`, `menu` roving, `menu-trigger` aria, `snackbar` announce,
  `avatar` initials, container landmarks.
