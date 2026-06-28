# DesignFoundry.Lucent (Razor RCL)

Lucent's Blazor component library — **Account's first consumer target**. A Razor
Class Library implementing the same contract as the Angular kit: it consumes the
shared `tokens/` + `css/` and **emits identical class names** so one CSS layer styles
both frameworks.

## State

Scaffold. Contains the foundation enums (`Foundations/ControlSize`,
`Foundations/Tone`) mirroring the Angular `sizing.ts` / `tone.ts`, plus
`FoundationTokens.ToToken()` — the helper that maps an enum to the lowercase class
token (`md`, `danger`) every component must emit. Components themselves are not built
yet.

`IsPackable` is `false` at `0.0.0-dev` — packaging/publishing is a **v1.0.0** task
(`DesignFoundry.Lucent` on NuGet).

## Consuming during dev (before 1.0.0)

Account references this via project reference (no published package needed):

```
dotnet add <Account.Web.csproj> reference \
  ../../lucent/packages/razor/DesignFoundry.Lucent.csproj
```
