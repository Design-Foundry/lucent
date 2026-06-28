namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Shared control density scale — the C# mirror of Lucent's <c>ControlSize</c>
/// (packages/angular/src/sizing.ts). Every interactive control accepts a
/// <see cref="ControlSize"/> so controls at the same size align side-by-side.
///
/// xs 24 · sm 28 · md 32 (default) · lg 40 — see the <c>--control-*</c> tokens in
/// tokens/_controls.scss and docs/FOUNDATIONS-DENSITY.md.
/// </summary>
public enum ControlSize
{
    Xs,
    Sm,
    Md,
    Lg,
}
