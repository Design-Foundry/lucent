namespace DesignFoundry.Lucent.Showcase;

/// <summary>One entry in the showcase navigation.</summary>
public record CatalogEntry(string Name, string Route, string Category);

/// <summary>
/// The single list of showcase pages, grouped by the roadmap's functional taxonomy.
/// Add a row here when you add a component page — this is what the nav and the
/// "what's ported" overview render from.
/// </summary>
public static class Catalog
{
    public static readonly IReadOnlyList<CatalogEntry> Entries =
    [
        new("Foundations", "/c/foundations", "Foundations"),

        new("Icon", "/c/icon", "Primitives"),
        new("Tag", "/c/tag", "Primitives"),
        new("Status tag", "/c/status-tag", "Primitives"),
        new("Tooltip", "/c/tooltip", "Primitives"),

        new("Button", "/c/button", "Actions"),
        new("Icon button", "/c/icon-button", "Actions"),

        new("Toggle", "/c/toggle", "Inputs"),
        new("Checkbox", "/c/checkbox", "Inputs"),
        new("Chip", "/c/chip", "Inputs"),
        new("Text input", "/c/text-input", "Inputs"),
        new("Inline input", "/c/inline-input", "Inputs"),
        new("Option", "/c/option", "Inputs"),
        new("Select", "/c/select", "Inputs"),

        new("Avatar", "/c/avatar", "Data display"),
        new("List", "/c/list", "Data display"),

        new("Card", "/c/card", "Containers"),
        new("Tabs", "/c/tabs", "Containers"),
        new("Menu", "/c/menu", "Containers"),
        new("Modal", "/c/modal", "Containers"),

        new("Nav rail", "/c/nav-rail", "Navigation"),
        new("Activity bar", "/c/activity-bar", "Navigation"),
        new("Breadcrumbs", "/c/breadcrumbs", "Navigation"),

        new("Snackbar & toast", "/c/feedback", "Feedback"),
    ];

    public static IEnumerable<IGrouping<string, CatalogEntry>> ByCategory() =>
        Entries.GroupBy(e => e.Category);
}
