namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Severity for <c>LucentInlineNotice</c> — the C# mirror of the Angular
/// <c>InlineNoticeVariant</c> union (<c>info | success | warning | error</c>). Maps to
/// <c>lucent-inline-notice--{token}</c>.
/// </summary>
public enum InlineNoticeVariant
{
    Info,
    Success,
    Warning,
    Error,
}
