namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Visual type of a <c>LucentChip</c> — the C# mirror of the Angular <c>ChipType</c> union.
/// <c>Tag</c> prepends a hash glyph; <c>Action</c> appends a close button;
/// <c>Active</c> is the selected (accent-filled) state. Maps to <c>lucent-chip--{token}</c>.
/// </summary>
public enum ChipType
{
    Tag,
    Default,
    Active,
    Action,
}
