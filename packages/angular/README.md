# @design-foundry/lucent (Angular kit)

The Angular implementation of the Lucent class contract. Every component emits the
`lucent-` class names defined in [`styles/`](../../styles/) and ships **zero CSS of its
own** — appearance lives in the shared stylesheet, so this kit and the React, Web
Components, and Razor kits all render identically.

Components read the shared tokens in `styles/tokens/` as runtime CSS custom properties.

## Build

```bash
npm run lib:build      # ng-packagr → dist/lucent
npm run lib:pack       # + npm pack
npm run showcase       # verification host (samples/lucent-angular-showcase)
```

`package.json` is `"private": true` at `0.0.0-dev`. Nothing is published — see the
[disclaimer](../../README.md) in the root README.
