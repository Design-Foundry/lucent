namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// A timed event consumed by <c>LucentSchedulerWeek</c> (positioned on the hour grid) — the C#
/// mirror of the React/Angular <c>TimedEvent</c> interface. <see cref="StartHour"/> /
/// <see cref="EndHour"/> are decimal hours (e.g. 9.5 = 9:30).
/// </summary>
public record TimedEvent(DateTime Date, double StartHour, double EndHour, EventCategory Category, string Title);
