# How to build a new component

A step-by-step runbook for adding a component to the kit so it matches everything already
here. Read [CONVENTIONS.md](./CONVENTIONS.md) first — this is that rulebook turned into an
ordered checklist. The canonical worked example is **`df-list-item`**; when in doubt, open it
and copy its shape.

---

## 0. Before you write code

1. **Is it really new?** Check [components/](./components/) and [index.ts](../index.ts). Many
   "new" rows/controls are a specialization of an existing primitive — `df-option` and
   `df-menu-item` are `df-list-item` with extra ARIA, not separate things. Specialize, don't
   duplicate.
2. **Pick the tier** (Primitive / Interactive / Navigation / Form input / Data display /
   Container / Overlay). It decides where the export goes and what it may depend on — lower
   tiers must not import higher ones.
3. **Name it** per [CONVENTIONS §2](./CONVENTIONS.md): folder = selector minus `df-`.

## 1. Scaffold the folder

```
my-thing/
  my-thing.ts
  my-thing.html      # skip only if the template is ~1 element → use inline `template:`
  my-thing.scss
```

## 2. Write the component class

Start from this skeleton and delete what you don't need:

```ts
import { ChangeDetectionStrategy, Component, booleanAttribute, contentChild, input, output } from '@angular/core';
import { DfIcon } from '../icon/icon';
import { DfLeading } from '../slots/slots';

export type MyThingVariant = 'default' | 'strong';   // export unions consumers pass

@Component({
  selector: 'df-my-thing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfIcon],
  templateUrl: './my-thing.html',
  styleUrl: './my-thing.scss',
  host: {
    '[class.is-selected]': 'selected()',
    '[class.is-disabled]': 'disabled()',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)': 'activate()',
    '(keydown.enter)': 'onKeyActivate($event)',
    '(keydown.space)': 'onKeyActivate($event)',
  },
})
export class DfMyThing<T = unknown> {
  readonly value    = input<T>();                                          // typed identity
  readonly label    = input('');                                          // Rule 1 shorthand
  readonly icon     = input('');                                          // Rule 2 shorthand
  readonly variant  = input<MyThingVariant>('default');                   // configuration
  readonly selected = input(false, { transform: booleanAttribute });     // §6 vocab
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly interactive = input(true, { transform: booleanAttribute });

  readonly activated = output<T | undefined>();                           // past-tense output

  protected readonly leadingRef = contentChild(DfLeading);               // gate icon fallback

  protected activate(): void {
    if (this.interactive() && !this.disabled()) this.activated.emit(this.value());
  }
  protected onKeyActivate(event: Event): void {
    if (!this.interactive() || this.disabled()) return;
    event.preventDefault();
    this.activate();
  }
}
```

**Rules baked in:** signal inputs (§4), `booleanAttribute` so bare attributes work, generic
value, past-tense output, fixed state vocab (§6), keyboard a11y (§7).

## 3. Write the template

Primary content projects with a `label` fallback; adornments use `dfLeading`/`dfTrailing`;
second line uses `dfSupporting`:

```html
@if (icon() && !leadingRef()) { <df-icon class="df-my-thing__icon" [name]="icon()" size="sm" /> }
<ng-content select="[dfLeading]" />

<span class="df-my-thing__content">
  <span class="df-my-thing__primary"><ng-content>{{ label() }}</ng-content></span>
  @if (supportingRef()) { <span class="df-my-thing__supporting"><ng-content select="[dfSupporting]" /></span> }
</span>

<ng-content select="[dfTrailing]" />
```

## 4. Write the styles

Semantic tokens only — no hex/px/font names ([CONVENTIONS §8](./CONVENTIONS.md)). Use the
working hover/selected pattern, **not** the dead `surface-subtle` token:

```scss
:host {
  display: flex;
  align-items: center;
  gap: var(--dimension--primitive--spacing-2);
  padding: var(--dimension--primitive--spacing-2) var(--dimension--primitive--spacing-3);
  border-radius: var(--radius-md);

  &.is-interactive {
    cursor: pointer;
    &:hover:not(.is-selected):not(.is-disabled) { background: var(--color--semantic--surface-base); }
    &:focus-visible { outline: 2px solid var(--color--semantic--border-focus); outline-offset: -2px; }
  }
  &.is-selected { background: oklch(from var(--color--semantic--surface-base) calc(l - 0.04) c h); }
  &.is-disabled { cursor: not-allowed; opacity: 0.5; pointer-events: none; }
}
```

## 5. If it's a form control

Add the CVA wiring ([CONVENTIONS §9](./CONVENTIONS.md)) and make `setDisabledState` set the
same disabled signal as the `[disabled]` input. Copy `df-input` / `df-checkbox`.

## 6. If it's a collection

Default to projecting typed children (copy `df-tab-list`). Only add an `items`/`options`
array input as a convenience, and its item type must be **as capable as** the projected
child ([CONVENTIONS §5](./CONVENTIONS.md)) — don't repeat the `SelectOption` bug.

## 7. Export it

Add to [`index.ts`](../index.ts) **in the right tier section**, exporting the class and any
public types:

```ts
export { DfMyThing } from './my-thing/my-thing';
export type { MyThingVariant } from './my-thing/my-thing';
```

## 8. Document it

1. Add a per-component page under [components/](./components/) using
   [`_TEMPLATE.md`](./components/_TEMPLATE.md). Fill in the **Conventions check** section
   honestly — that's where drift gets caught.
2. Add the row to the table in [components/README.md](./components/README.md).
3. Add the entry to [API.md](./API.md).

## 9. Add it to the showcase

Add a block to `src/app/dev/showcase/showcase.html` (and import it in `showcase.ts`)
demonstrating each variant/state. This is the living visual reference.

## 10. Verify

```bash
cd hub/web && npm run build     # type-checks templates, generics, and tokens
```

Then eyeball it in the showcase (`npm start`, dev-only route) in both light and dark themes.

---

## Pre-merge checklist

- [ ] `standalone: true`, `OnPush`, signal inputs, `booleanAttribute` on booleans
- [ ] Primary content projects with `label` fallback (not a bare `{{ label() }}`)
- [ ] Adornments use `dfLeading`/`dfTrailing` + `icon` shorthand (never `name`)
- [ ] State vocab correct: `selected` = chosen, `active` = keyboard highlight only
- [ ] `disabled` is an input **and** honored by forms (if a control)
- [ ] Output past-tense; value typed (generic), not `unknown`
- [ ] Interactive → `role` + `tabindex` + Enter/Space + `:focus-visible`
- [ ] SCSS uses semantic tokens only; no `surface-subtle`
- [ ] Exported from `index.ts` in the correct tier
- [ ] Per-component doc + API.md + showcase updated
- [ ] `npm run build` passes
