namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Action intent ("tone") for interactive controls — the C# mirror of Lucent's
/// <c>Tone</c> (packages/angular/src/tone.ts). Orthogonal to visual variant and to
/// the info/success/warning/error status scale.
///
/// <see cref="Danger"/> marks destructive actions (delete, remove) in red. Keep the
/// vocabulary identical kit-wide (we use <c>danger</c>, not <c>destructive</c>).
/// See docs/CONVENTIONS.md §6.
/// </summary>
public enum Tone
{
    Default,
    Danger,
}
