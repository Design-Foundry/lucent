# Components roadmap

What the kit is missing relative to the major design systems, what to build next, and how to
categorize it — framed for **our** domain: a dense, control-heavy DesignOps tool (closer to
Figma/Linear than to a SaaS dashboard). Pairs with [API-AUDIT.md](./API-AUDIT.md) (consistency
of what exists) and [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md) (the density system).

---

## 1. Positioning — anchor on Fluent + AppKit, not Material

Material 3 and Apple HIG-mobile are **touch-first**: large targets, generous whitespace, one
primary action per view. Adopting their sizing/component selection produces the tall,
low-density UI we explicitly don't want. The systems built for dense desktop tools are:

- **Fluent 2** (Office/Teams) — explicit `size` props, productivity density, and exactly the
  controls a tool UI needs (SpinButton, Toolbar, Tree, Combobox, Field, MessageBar).
- **Apple AppKit** — `controlSize` (mini/small/regular/large), segmented controls, steppers,
  source lists/outline views, NSToolbar, split views. The precedent Figma/Sketch lean on.

**Decision:** Fluent + AppKit are the primary references; MUI is the pragmatic React reference;
Material/HIG inform visual/motion polish only — not sizing or component selection.

## 2. Density is the headline gap (in progress)

The biggest gap was never a missing component — it was that core controls (`button`, `input`,
`select`, `checkbox`, `chip`) had **no size at all**, so they couldn't be height-matched in a
row, and the controls that *did* have sizes used **disagreeing scales**.

✅ **Done:** a shared `ControlSize` scale (`xs 24 · sm 28 · md 32 · lg 40`) with a bound token
set, retrofitted onto the five core controls. See [FOUNDATIONS-DENSITY.md](./FOUNDATIONS-DENSITY.md).

⏳ **Next for density:** migrate `icon-button` / `toggle` / `tab` / `avatar` onto `ControlSize`;
later, an optional container-level `[dfDensity]` to set a whole panel's size in one place.

## 3. Categorization (target taxonomy)

The current tier scheme (Primitives → Interactive → …) mixes abstraction with function and
buries the density-critical controls. Move to a **functional taxonomy with a Patterns layer**,
which pulls Actions + Inputs (≈70% of our surface) to the front:

| Category | Holds |
|---|---|
| **Foundations** | tokens, **density/size**, color, type, elevation, motion, icons |
| **Actions** | button, icon-button, split/menu button, segmented group, link, menu, toolbar |
| **Inputs** | text/number/textarea/inline, select/combobox, checkbox/radio/toggle, slider, color, search, field wrapper |
| **Data & selection** | list, tree, table, tag/chip/badge/status, avatar |
| **Navigation** | nav-rail, tabs, breadcrumbs, stepper, pagination |
| **Containers & layout** | card, panel/drawer, split/resizable, accordion, divider, property-row |
| **Feedback & status** | toast, snackbar, banner, progress, skeleton, tooltip, empty-state |
| **Overlays** | modal/dialog, popover, context-menu, command-palette (+ services) |
| **Patterns** | inspector/property panel, toolbar layouts, form layouts — composed, opinionated |

The **Patterns** layer is our differentiator: dense tools are composed of clusters (a property
row = label + control + reset; a toolbar group), and none of the big four ship strong patterns.

## 4. Gap analysis

What the major systems have that we don't, with the best reference and why it matters here.

### Tier 0 — foundational (build with/before new components)
| Item | Reference | Why now |
|---|---|---|
| Density/size system | Fluent, AppKit | ✅ in progress (§2) — the unlock for everything |
| **Field wrapper** (`df-form-field`) | Fluent `Field` | Unifies `dfLabel/dfHint/dfError` (today duplicated in input+select); every new input rides on it |

### Tier 1 — highest leverage for "controls everywhere"
| Item | Reference | Why now |
|---|---|---|
| **Segmented control / toggle-group** | All four (AppKit, Fluent ToggleButton) | Dense alternative to radios/tabs — alignment toggles, view switches; everywhere in Figma |
| **Number field + stepper** (scrubby) | Fluent SpinButton, AppKit Stepper | Design tools are full of numeric fields (x/y/w/h/opacity); we have none |
| **Toolbar** (groups, dividers, overflow) | Fluent Toolbar, NSToolbar | Formalize `activity-bar` into the home for dense control clusters |
| **Popover** (generic) | All four | Unblocks property panels, pickers, mini-forms (we only have menu/tooltip) |
| **Radio + radio-group** | All four | Table-stakes form control; missing |
| **Tree / outline** | Fluent Tree, AppKit source list | Layers / component hierarchy — core to a design tool |

### Tier 2 — fill the obvious holes
| Item | Reference | Note |
|---|---|---|
| Combobox / autocomplete | Fluent Combobox | `select` is array-only & untyped (API-AUDIT §3) |
| Drawer / side-panel | All four | Side panels are everywhere in tools |
| Context menu (right-click) | All four | Essential on a canvas |
| Badge (count/dot) | All four | Distinct from chip/tag |
| Spinner + Progress (components) | All four | Today CSS-class only |
| Skeleton (component) | MUI, Fluent | Today CSS-class only |
| Banner / inline alert | Fluent MessageBar | Persistent, vs transient toast |
| Textarea | All four | Missing |
| Link | Fluent | Missing |
| Tab-panel (aria wiring) | All four | `tab-list` has no panel association |
| General divider | All four | Unify `nav-divider` + `menu-divider` |
| Table / Data grid | MUI DataGrid, Fluent | Bigger effort; versions/members/assets |

### Tier 3 — domain polish
Resizable/split panels · Slider · Color field/swatch · Command palette (⌘K) · kbd ·
Pagination · Empty-state · Accordion/disclosure.

## 5. Recommended build order

1. **Density scale** (✅) → migrate the ⚠️ controls onto it.
2. **Field wrapper** — foundation for all inputs.
3. **Segmented control**, **number field**, **toolbar** — the three that most relieve
   "infinite vertical slots."
4. **Popover** → unblocks property panels → **radio-group**, **tree**.
5. Re-tier docs/index to the §3 taxonomy.
6. Tier 2 as product needs surface; Tier 3 as polish.

## 6. Status

| Done | In progress / next |
|---|---|
| `ControlSize` scale + tokens; retrofit of button/input/select/chip/checkbox | Migrate icon-button/toggle/tab/avatar to `ControlSize`; field wrapper; segmented control |

Keep this doc current as items land — it's the single place that answers "what next and why."

## 7. Parked

**Named layout presets** (`stack`, `row`, `cluster`, `grid`, `split`, `box`). Parked 2026-10-11.

Three levels exist: mechanical utilities (per-property, Tailwind style), intent presets (a few named
layouts whose only knob is a spacing scale), and patterns (property row, inspector, form layout).
The presets are the middle level. They were parked because they are close to a preset with no
consumer yet, and because the design system has no home for a layout that is not a component. Text
utilities are different: they project typography tokens that already exist (see
[text.md](./components/text.md)).

To revive: model each preset as a component of the system (a surface root, a body slot, axes bound
to the spacing collection). That needs `wrap` and automatic grid columns in the model, recorded in
hub `docs/model-decisions-bench.md` as D13. `gap` and padding stay style properties.
