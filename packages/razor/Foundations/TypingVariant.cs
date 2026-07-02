namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Mode for <c>LucentTypingIndicator</c> — the C# mirror of the Angular <c>TypingVariant</c>
/// union. <c>Typing</c> = a person is composing; <c>Generating</c> = the agent is producing.
/// Maps to <c>lucent-typing-indicator--{token}</c>.
/// </summary>
public enum TypingVariant
{
    Typing,
    Generating,
}
