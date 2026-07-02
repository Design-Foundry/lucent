namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Shape of a <c>LucentPromptSuggestion</c> — the C# mirror of the Angular
/// <c>PromptSuggestionVariant</c> union. <c>Card</c> is roomy (icon + title + optional
/// description); <c>Chip</c> is a compact pill. Maps to <c>lucent-prompt-suggestion--{token}</c>.
/// </summary>
public enum PromptSuggestionVariant
{
    Card,
    Chip,
}
