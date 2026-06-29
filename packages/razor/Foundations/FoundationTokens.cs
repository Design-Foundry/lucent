namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Maps foundation enums to the lowercase class-name tokens that Lucent components
/// emit (e.g. <c>lucent-button--md</c>, <c>lucent-button--danger</c>). Both the Angular
/// and Razor kits MUST emit identical tokens so a single CSS layer styles both — this is
/// the cross-framework contract (see styles/README.md). The Razor kit emits the
/// <c>lucent-</c> names now; the parked Angular kit still emits <c>df-</c> until rebranded.
/// </summary>
public static class FoundationTokens
{
    /// <summary>Class-name token for a <see cref="ControlSize"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this ControlSize size) => size switch
    {
        ControlSize.Xs => "xs",
        ControlSize.Sm => "sm",
        ControlSize.Md => "md",
        ControlSize.Lg => "lg",
        _ => "md",
    };

    /// <summary>Class-name token for a <see cref="Tone"/> — e.g. <c>danger</c>.</summary>
    public static string ToToken(this Tone tone) => tone switch
    {
        Tone.Danger => "danger",
        _ => "default",
    };

    /// <summary>Class-name token for a <see cref="LucentButtonVariant"/> — e.g. <c>on-glass</c>.</summary>
    public static string ToToken(this LucentButtonVariant variant) => variant switch
    {
        LucentButtonVariant.Secondary => "secondary",
        LucentButtonVariant.Ghost => "ghost",
        LucentButtonVariant.OnGlass => "on-glass",
        LucentButtonVariant.Danger => "danger",
        LucentButtonVariant.Text => "text",
        _ => "primary",
    };
}
