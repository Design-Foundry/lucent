namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Colour axis for <c>LucentBadge</c> — the C# mirror of the Angular <c>BadgeVariant</c>
/// union (<c>accent | error | success | neutral</c>). This is a solid-filled indicator
/// scale (unread accent, error/success severity), distinct from <see cref="StatusTagVariant"/>
/// (a subtle record-state pill) and action <see cref="Tone"/>. Maps to <c>lucent-badge--{token}</c>.
/// </summary>
public enum BadgeVariant
{
    Accent,
    Error,
    Success,
    Neutral,
}
