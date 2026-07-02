namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Grouping of a <c>LucentMessageBubble</c> in a run — the C# mirror of the Angular
/// <c>MessageGroup</c> union. <c>Standalone</c> shows the tail; <c>Continuation</c> (a
/// consecutive message from the same sender) drops it. Maps to
/// <c>lucent-message-bubble--{token}</c>.
/// </summary>
public enum MessageGroup
{
    Standalone,
    Continuation,
}
