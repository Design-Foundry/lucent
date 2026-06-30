namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// One crumb in a <c>LucentBreadcrumbs</c> trail — the C# mirror of the Angular
/// <c>BreadcrumbItem</c> interface. <see cref="Path"/> is optional (for navigation);
/// <see cref="Data"/> carries an arbitrary payload back to the click handler.
/// </summary>
public record BreadcrumbItem(string Label, string? Path = null, object? Data = null);
