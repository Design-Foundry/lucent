namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Shape/content of a <c>LucentBadge</c> — the C# mirror of the Angular <c>BadgeKind</c>
/// union. <c>Count</c> is a numeric pill (tabular figures); <c>Label</c> a short text pill
/// ("AI", "NEW"); <c>Dot</c> a bare presence circle with no content. Maps to
/// <c>lucent-badge--{token}</c>.
/// </summary>
public enum BadgeKind
{
    Count,
    Label,
    Dot,
}
