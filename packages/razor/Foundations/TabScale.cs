namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Size of a <c>LucentTab</c> — the C# mirror of the Angular <c>TabScale</c> union
/// (lg/md/sm/xs). Usually driven by the parent <c>LucentTabList</c>. Predates the shared
/// <see cref="ControlSize"/> scale; migration is a tracked roadmap item.
/// </summary>
public enum TabScale
{
    Lg,
    Md,
    Sm,
    Xs,
}
