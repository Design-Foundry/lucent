namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Severity of a <c>LucentToast</c> — the C# mirror of the Angular <c>ToastVariant</c> union.
/// The status axis (info/success/warning/error); each tints the toast's background and text.
/// </summary>
public enum ToastVariant
{
    Informative,
    Success,
    Warning,
    Error,
}
