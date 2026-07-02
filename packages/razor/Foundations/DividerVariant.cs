namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Variant for <c>LucentDivider</c> — the C# mirror of the Angular <c>DividerVariant</c> union.
/// <c>Plain</c> is a hairline rule; <c>Labeled</c> is a rule with centered text. Maps to
/// <c>lucent-divider--{token}</c>.
/// </summary>
public enum DividerVariant
{
    Plain,
    Labeled,
}
