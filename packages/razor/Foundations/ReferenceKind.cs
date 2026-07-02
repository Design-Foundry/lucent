namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Entity kind a <c>LucentReferenceTag</c> points at — the C# mirror of the Angular
/// <c>ReferenceKind</c> union. <c>Mention</c> (@person/agent), <c>Component</c>, <c>Token</c>
/// (with a colour swatch + mono name), <c>Resource</c> (PR/doc). Maps to
/// <c>lucent-reference-tag--{token}</c>.
/// </summary>
public enum ReferenceKind
{
    Mention,
    Component,
    Token,
    Resource,
}
