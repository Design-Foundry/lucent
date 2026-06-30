namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Size scale for <c>LucentIcon</c> — the C# mirror of the Angular icon's
/// <c>IconSize</c> (packages/angular/src/icon/icon.ts). Distinct from
/// <see cref="ControlSize"/>: icons add an <c>xl</c> step and have no density semantics.
/// Each value maps a <c>--dimension--primitive--icon-{token}</c> glyph box.
/// </summary>
public enum IconSize
{
    Xs,
    Sm,
    Md,
    Lg,
    Xl,
}
