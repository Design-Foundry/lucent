# CSS layer

The framework-neutral **component styles**, keyed to the semantic class names both
kits emit (`df-button--md`, `df-button--danger`, …). One stylesheet styles both the
Angular and Razor components — this is the load-bearing rule that keeps two
implementations visually identical.

**Currently empty.** The component CSS still lives inside the parked Angular
components (`packages/angular/src/<component>/<component>.scss`). As each component
gets a Razor counterpart, its styles get extracted here as neutral CSS so both kits
share them. Until then, `tokens/` holds the shared foundation; this holds nothing.
