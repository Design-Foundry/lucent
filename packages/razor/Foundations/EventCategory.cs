namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// The kind of a scheduled event — drives its category color (the C# mirror of the React/Angular
/// <c>EventCategory</c> union). The lower-cased name is the CSS modifier suffix
/// (<c>lucent-event-chip--work</c>, …).
/// </summary>
public enum EventCategory
{
    Work,
    Meeting,
    Personal,
    Deadline,
}
