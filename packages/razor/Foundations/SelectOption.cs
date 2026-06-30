namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// One choice in a <c>LucentSelect</c> — the C# mirror of the Angular <c>SelectOption</c>
/// interface. <see cref="Value"/> is the identity emitted on selection (untyped, matching
/// the current Angular API; a generic select is a tracked roadmap item).
/// </summary>
public record SelectOption(string Label, object? Value);
