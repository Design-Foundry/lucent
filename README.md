# Lucent

A design system for dense product interfaces: one framework-neutral stylesheet and an
Angular kit that emits its class names.

> **Reference sample.** Lucent is published so the work can be read. It is on 0.x with no
> deprecation policy: names and APIs change whenever the system turns out to be wrong.
> Issues are closed and pull requests are not accepted. If any of it is useful to you,
> fork it.

---

## What it is

Lucent is the design system behind [Design Foundry](https://designfoundry.app)'s
products. One plain-CSS layer defines **57 components** as a contract of class names.
The Angular kit implements all of them.

**A component's definition and its implementation are different things.** The class
contract says which parts must exist: the parts style and interaction are defined on.
It does not say they are the only nodes present. A kit is free to add whatever wrappers,
hosts or portals its framework needs; the contract is a floor, not a ceiling.

The CSS is written that way on purpose. Of the component rules, seven use a direct-child
combinator, and all seven are popovers that must be positioned against their field.
Everything else is descendant-matched and survives extra nodes.

The kit is deliberately thin. It ships no component CSS, and it is not required: emit the
classes by hand and you get the component, with no framework in the picture at all.

```html
<span class="lucent-button lucent-button--primary lucent-button--md">
  <button class="lucent-button__inner">Save changes</button>
</span>
```

That is what an Angular `<lucent-button>` produces. The kit exists to make it typed and
ergonomic, not to make it work. Paste the markup above into a page that links the
stylesheet and you get the same button with no kit at all.

It also shows the contract's shape: two named parts, a host and an `__inner`. That they
are a `<span>` and a `<button>` is the *implementation's* choice, not the system's; the
CSS never names an element. Another implementation could reach for `<div>` and `<a>`, or
add a wrapper of its own, and the styling still lands.

## Why it looks like this

Lucent is built for **consoles, inboxes, and schedulers**, screens where a user spends
their working day, not for landing pages. That single decision explains most of the
surface:

- **Density is a contract, not a size prop.** Every control reads its height, text size,
  icon size, radius, inline padding, and gap from one alias layer
  (`styles/tokens/controls.css`). Set a button, a select, and a date field to the same
  size and they align, because they are literally reading the same six tokens. Re-point
  those six and the entire product changes register without touching a component.
- **One accent, held quiet.** A pine green carries interaction; everything else is
  neutral. In a screen with two hundred elements, a restrained palette is what makes the
  one actionable thing findable.
- **Glass over a quiet ground.** Surfaces are translucent and blurred by default, which
  gives depth without borders everywhere. Where that costs legibility (a control room
  read from two metres) the blur is turned off at the token layer, not overridden per
  component.
- **Colour is authored in `oklch`.** Ramps are perceptually even, so a step is the same
  visual distance everywhere on the wheel, and derivations (`oklch(from … l c h / α)`)
  stay predictable instead of drifting hue.

Light and dark are the same components reading a re-pointed semantic layer.

The component reference, foundations, and four vertical demos (billing, helpdesk,
orders, and booking, each dressed as a different product, with live token editing) are
at **[lucent.designfoundry.app](https://lucent.designfoundry.app)**.

## Why it's built like this

**Three token tiers, one direction.** Primitives are raw values. Semantic tokens name
roles (`surface-raised`, `text-strong`, `accent-default`). Components read semantics and
never reach past them to a primitive. Dark mode, and every skin in the demos, are the
same mechanism: re-point the semantic layer and every component follows, with no rebuild
and no component edits.

The one rule that falls out of this and is easy to get wrong: a custom property that
references another is substituted **where it is declared**. Semantic tokens are declared
on `:root`, so they resolve against the root primitives before any wrapper sees them.
A themed wrapper can only override the token a component reads *directly*, which is why
skins re-declare semantic tokens, and why composite tokens like `--border-default` have
to be written alongside the colour they are built from.

**Light DOM, deliberately.** Nothing uses Shadow DOM. Three concrete reasons:

- Form controls participate in a real `<form>`: no `ElementInternals` shim, no value
  plumbing across a boundary.
- ARIA references cross elements by ID. `aria-labelledby`, `aria-describedby`, and
  `aria-controls` do not traverse a shadow root; encapsulation would break the
  accessibility wiring between a field, its label, and its error text.
- One global stylesheet reaches the kit without ceremony. Encapsulation would mean a
  second CSS contract to keep in sync with the first, the exact duplication this repo
  exists to avoid.

The cost is real and accepted: authors can restyle anything, and there is no protection
from a colliding global selector.

**An explicit stacking scale.** Overlays used to each pick their own `z-index`, so every
popover lost to a modal. `styles/tokens/layers.css` makes the order a decision rather than
an accident, and puts `--layer-popover` *above* `--layer-modal`, because a select opened
inside a dialog has to be visible.

**Contrast is measured, not judged.** Colour pairs are checked against WCAG 2.2 by
painting them and computing relative luminance, rather than eyeballed. That is how the
demos caught a real shipped bug: in dark mode the accent flipped light while the text on
it stayed light, giving **1.94:1** on the primary button in every consuming app.

## Layout

```
styles/                @design-foundry/lucent-styles  (plain CSS, no build step)
  core.css               tokens + the 43 components every product needs
  packs/                 messaging, temporal, scheduler (opt-in, by domain)
  lucent.css             core + every pack
  tokens/                primitives, semantic roles, control aliases, themes, layers
  components/            one stylesheet per component, keyed to lucent- class names
brand/                 the Lucent mark, generated by brand/build.mjs
packages/
  angular/               @design-foundry/lucent-angular  (Angular library, ng-packagr)
samples/
  lucent-angular-showcase  Angular verification host
```

`styles/` is the source of truth. A kit that disagrees with them is the
thing that is wrong.

## Running it

```bash
npm install
npm run showcase
```

The showcase accepts `?theme=light|dark`, which drives `<html data-theme>`.

To use the CSS on its own, with no kit and no build step, one import is the whole setup.
`lucent.css` pulls in the tokens, core and every pack in cascade order:

```css
@import 'styles/lucent.css';
```

## Licence

[Apache License 2.0](./LICENSE). See [NOTICE](./NOTICE) for attribution requirements
and [CONTRIBUTING.md](./CONTRIBUTING.md) for why this repository does not take patches.
The Lucent name and mark are not licensed for use as your own branding.
