namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Visual style of a <c>LucentButton</c> — the C# mirror of the Angular button's
/// variant union. Each value maps to a <c>lucent-button--{token}</c> class
/// (see styles/components/button.css). Orthogonal to <see cref="ControlSize"/>.
/// </summary>
public enum LucentButtonVariant
{
    /// <summary>Solid accent fill — the primary call to action.</summary>
    Primary,
    /// <summary>Subtle accent fill — secondary emphasis.</summary>
    Secondary,
    /// <summary>Bordered, surface fill — low emphasis.</summary>
    Ghost,
    /// <summary>Translucent fill for use over imagery/glass surfaces.</summary>
    OnGlass,
    /// <summary>Destructive action styling (red).</summary>
    Danger,
    /// <summary>Text-only, underlined — link-like.</summary>
    Text,
}
