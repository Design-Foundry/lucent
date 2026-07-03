namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// An inclusive start–end date pair, chosen with <c>LucentDateRangePicker</c> — the C# mirror of
/// the React/Angular <c>DateRange</c> interface. Endpoints are normalized so <see cref="Start"/>
/// is never after <see cref="End"/>.
/// </summary>
public record DateRange(DateTime Start, DateTime End);
