# @designfoundry/lucent-styles

The stylesheet of [Lucent](https://github.com/Design-Foundry/lucent), a design system for
dense product interfaces: design tokens and 54 components, written as plain CSS with no
build step. A component is a contract of `lucent-` class names; emit the classes and you get
the component, with or without a framework kit.

```html
<span class="lucent-button lucent-button--primary lucent-button--md">
  <button class="lucent-button__inner">Save changes</button>
</span>
```

## Install

```bash
npm install @designfoundry/lucent-styles
```

For Angular, [`@designfoundry/lucent-angular`](https://www.npmjs.com/package/@designfoundry/lucent-angular)
emits the same classes as typed components. Both packages are always on the same version.

## Use

Import `core.css` and the packs your product needs, or `lucent.css` for everything:

```css
@import '@designfoundry/lucent-styles/core.css';
@import '@designfoundry/lucent-styles/packs/messaging.css';
```

| File | Contents |
|---|---|
| `core.css` | Tokens and the 40 components every product needs |
| `packs/messaging.css` | Conversation UI (9 components) |
| `packs/temporal.css` | Calendar, date picker, time picker |
| `packs/scheduler.css` | Events and the month, week and agenda views |
| `lucent.css` | Core and every pack |

A component belongs in core when it needs no concept from outside the design system. A pack
component presupposes a domain: the scheduler presupposes events, the composer presupposes
messages. Each component ships in exactly one file.

Load the fonts the tokens name: Outfit, Roboto Mono and Material Icons.

## Themes

Set `data-theme="light"` or `data-theme="dark"` on `<html>`, or leave it unset to follow the
system. A theme is the semantic token layer re-pointed; components never change.

## Tokens

Two tiers, primitive and semantic, plus a control-density alias (`--control-*`) that keeps
buttons, fields and selects of the same size aligned on one row. Components read semantic
and control tokens only, so re-pointing those restyles the whole system.

The component reference is at [lucent.designfoundry.app](https://lucent.designfoundry.app).
Changes are listed in the
[changelog](https://github.com/Design-Foundry/lucent/blob/main/CHANGELOG.md).

## Licence

[Apache License 2.0](https://github.com/Design-Foundry/lucent/blob/main/LICENSE).
