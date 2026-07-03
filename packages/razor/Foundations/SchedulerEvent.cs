namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// A single event as consumed by <c>LucentMonthCell</c> — the C# mirror of the React/Angular
/// <c>SchedulerEvent</c> interface.
/// </summary>
public record SchedulerEvent(EventCategory Category, string Label, string? Time = null);
