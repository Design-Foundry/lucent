# Lucent conformance

Checks every kit against the reference rendering of each definition: normalized DOM, computed styles and
the accessibility tree, in light and dark, at rest and under forced states.

```bash
npm install --prefix conformance
npx --prefix conformance playwright install chromium
npm run conformance
```

The run starts two servers: Vite on 4401 for the reference and React harnesses, and `ng serve
lucent-conformance-angular` on 4402. `npm --prefix conformance run report` opens the last HTML report.

To add a component: its scenarios in `scenarios/`, its reference markup in `harness/reference/markup.ts`,
written from the definition's Markup section, and a case in each kit harness.
