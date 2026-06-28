# Lucent

Design Foundry's design system — shared across the suite's apps.

## Distribution

| Consumer | Package | Registry |
|---|---|---|
| Angular (Hub) | `@design-foundry/lucent` | npm |
| Razor / Blazor (Account) | `DesignFoundry.Lucent` | NuGet |

The framework-neutral core (design **tokens**, the **CSS** layer keyed to semantic
class names, and the **spec docs**) is shared. Each framework ships its own
component implementation against that contract and emits identical class names, so
a single CSS layer styles both.

## Status

**Rescue snapshot.** `design-system/` is a verbatim harvest of the Angular kit out
of `hub/` (taken before Hub's rewrite, including in-flight foundations work:
`sizing.ts` / `tone.ts` / `_controls.scss` density + tone scales and the `docs/`
spec set). Not yet restructured.

### Next

- [ ] Restructure into `tokens/`, `css/`, `docs/`, `packages/angular`, `packages/razor`.
- [ ] Build the Razor Class Library (`DesignFoundry.Lucent`) — Account is the first consumer.
- [ ] Wire OIDC trusted publishing for npm + NuGet (no stored secrets).
