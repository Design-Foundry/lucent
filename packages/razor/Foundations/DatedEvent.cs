namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// A dated event consumed by <c>LucentSchedulerMonth</c> / <c>LucentSchedulerAgenda</c> (bucketed
/// by day) — the C# mirror of the React/Angular <c>DatedEvent</c> interface.
/// </summary>
public record DatedEvent(DateTime Date, EventCategory Category, string Label, string? Time = null);
