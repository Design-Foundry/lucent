# DesignFoundry.Lucent (Razor RCL)

Lucent's Blazor component library — **Account's first consumer target**. A Razor
Class Library implementing the same contract as the Angular kit: it consumes the
shared `styles/` base (plain-CSS tokens + component styles) and **emits identical
class names** so one CSS layer styles both frameworks.

## State

Scaffold. Contains the foundation enums (`Foundations/ControlSize`,
`Foundations/Tone`) mirroring the Angular `sizing.ts` / `tone.ts`, plus
`FoundationTokens.ToToken()` — the helper that maps an enum to the lowercase class
token (`md`, `danger`) every component must emit. Components themselves are not built
yet.

`IsPackable` is `false` at `0.0.0-dev` — packaging/publishing is a **v1.0.0** task
(`DesignFoundry.Lucent` on NuGet).

## Consuming during dev (before 1.0.0)

Account references this via **project reference** — no published package needed,
because `account/` and `lucent/` are siblings under the `design-foundry/` workspace.
Run from the Account.Web project dir:

```
dotnet add reference ..\..\..\lucent\packages\razor\DesignFoundry.Lucent.csproj
```

which records, relative to `DesignFoundry.Account.Web.csproj`:

```xml
<ProjectReference Include="..\..\..\lucent\packages\razor\DesignFoundry.Lucent.csproj" />
```

Live inner loop: edit a component in `lucent/`, rebuild Account, see it immediately
(F12 navigates into source; the debugger steps in). The RCL's CSS/JS flow to Account
as static web assets under `_content/DesignFoundry.Lucent/…`, same as a real package.

At **v1.0.0**, swap the `ProjectReference` for a `PackageReference` — the `_content/`
asset paths and `@using` stay identical, so consuming code doesn't change.
