namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// One segment of a <c>LucentSegmentedControl</c> — the C# mirror of the Angular
/// <c>SegmentedOption</c> shape. A label, the value it selects, and an optional disabled flag.
/// </summary>
/// <typeparam name="T">The value type the control selects.</typeparam>
public record SegmentedOption<T>(string Label, T Value, bool Disabled = false);
