namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Intent of a <c>LucentModal</c> — the C# mirror of the Angular <c>ModalVariant</c> union.
/// Drives the default footer: <c>Informative</c> has no footer; <c>Confirmation</c>/<c>Interactive</c>
/// show cancel + primary confirm; <c>Destructive</c> shows cancel + a danger confirm.
/// </summary>
public enum ModalVariant
{
    Informative,
    Confirmation,
    Interactive,
    Destructive,
}
