# @designfoundry/lucent-angular

The Angular kit for [Lucent](https://github.com/Design-Foundry/lucent), a design system for
dense product interfaces. Every component emits the `lucent-` class names defined by
[`@designfoundry/lucent-styles`](https://www.npmjs.com/package/@designfoundry/lucent-styles)
and ships no CSS of its own.

## Install

```bash
npm install @designfoundry/lucent-angular @designfoundry/lucent-styles @angular/cdk
```

Both Lucent packages are always on the same version; install them together.

## Set up

Add the stylesheet to the `styles` array in `angular.json`. `lucent.css` is everything;
`core.css` plus the packs you use is smaller:

```json
"styles": [
  "node_modules/@designfoundry/lucent-styles/core.css",
  "node_modules/@designfoundry/lucent-styles/packs/temporal.css"
]
```

Load the fonts the tokens name:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto+Mono:wght@100..700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
```

Set `data-theme="light"` or `data-theme="dark"` on `<html>`, or leave it unset to follow the
system.

## Use

Components are standalone; import the ones you need:

```ts
import { LucentButton } from '@designfoundry/lucent-angular';

@Component({
  imports: [LucentButton],
  template: `<lucent-button variant="primary">Save changes</lucent-button>`,
})
export class SaveBar {}
```

The component reference is at [lucent.designfoundry.app](https://lucent.designfoundry.app).
Changes are listed in the
[changelog](https://github.com/Design-Foundry/lucent/blob/main/CHANGELOG.md).

## Licence

[Apache License 2.0](https://github.com/Design-Foundry/lucent/blob/main/LICENSE).
