namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Shape for <c>LucentSkeleton</c> — the C# mirror of the Angular <c>SkeletonShape</c>
/// union. <c>Line</c> is a text-line placeholder, <c>Circle</c> an avatar/icon placeholder,
/// <c>Block</c> a media/card placeholder. Maps to <c>lucent-skeleton--{token}</c>.
/// </summary>
public enum SkeletonShape
{
    Line,
    Circle,
    Block,
}
