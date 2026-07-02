namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Sender role for a <c>LucentMessageBubble</c> — the C# mirror of the Angular
/// <c>MessageRole</c> union. <c>User</c> is the accent-tinted bubble; <c>Assistant</c>/<c>Other</c>
/// are surface bubbles; <c>System</c> is a quiet centered note. Maps to
/// <c>lucent-message-bubble--{token}</c>.
/// </summary>
public enum MessageRole
{
    User,
    Assistant,
    System,
    Other,
}
