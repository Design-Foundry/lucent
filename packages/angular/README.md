# @designfoundry/lucent-angular (Angular kit)

The Angular implementation of the Lucent class contract. Every component emits the
`lucent-` class names defined in [`styles/`](../../styles/) and ships no CSS of its own:
appearance lives in the shared stylesheet, published separately as
`@designfoundry/lucent-styles` (`core.css`, `packs/*.css`, or `lucent.css` for everything).

Components read the shared tokens in `styles/tokens/` as runtime CSS custom properties.

## Install

```bash
npm install @designfoundry/lucent-angular @designfoundry/lucent-styles @angular/cdk
```

Add `node_modules/@designfoundry/lucent-styles/core.css` (plus any packs) to the `styles`
array in `angular.json`, and load Outfit, Roboto Mono and Material Icons.

## Build

```bash
npm run lib:build      # ng-packagr → dist/lucent
npm run lib:pack       # + npm pack
npm run showcase       # verification host (samples/lucent-angular-showcase)
```

Pushing a `v*` tag publishes the package (`.github/workflows/publish.yml`).
