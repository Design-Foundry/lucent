namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Severity variant for <c>LucentStatusTag</c> — the C# mirror of the Angular
/// <c>StatusTagVariant</c> union. This is the <em>status</em> colour axis
/// (info/success/warning/error), distinct from action <see cref="Tone"/> (CONVENTIONS §6).
/// </summary>
public enum StatusTagVariant
{
    Success,
    Neutral,
    Warning,
    Error,
}
