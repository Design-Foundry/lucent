namespace DesignFoundry.Lucent.Foundations;

/// <summary>
/// Maps foundation enums to the lowercase class-name tokens that Lucent components
/// emit (e.g. <c>lucent-button--md</c>, <c>lucent-button--danger</c>). Both the Angular
/// and Razor kits MUST emit identical tokens so a single CSS layer styles both — this is
/// the cross-framework contract (see styles/README.md). The Razor kit emits the
/// <c>lucent-</c> names now; the parked Angular kit still emits <c>df-</c> until rebranded.
/// </summary>
public static class FoundationTokens
{
    /// <summary>Class-name token for a <see cref="ControlSize"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this ControlSize size) => size switch
    {
        ControlSize.Xs => "xs",
        ControlSize.Sm => "sm",
        ControlSize.Md => "md",
        ControlSize.Lg => "lg",
        _ => "md",
    };

    /// <summary>Class-name token for an <see cref="IconButtonSize"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this IconButtonSize size) => size switch
    {
        IconButtonSize.Sm => "sm",
        IconButtonSize.Lg => "lg",
        _ => "md",
    };

    /// <summary>The glyph <see cref="IconSize"/> an icon button uses at a given size.</summary>
    public static IconSize ToIconSize(this IconButtonSize size) => size switch
    {
        IconButtonSize.Sm => IconSize.Sm,
        IconButtonSize.Lg => IconSize.Lg,
        _ => IconSize.Md,
    };

    /// <summary>Class-name token for an <see cref="IconSize"/> — e.g. <c>lg</c>.</summary>
    public static string ToToken(this IconSize size) => size switch
    {
        IconSize.Xs => "xs",
        IconSize.Sm => "sm",
        IconSize.Md => "md",
        IconSize.Lg => "lg",
        IconSize.Xl => "xl",
        _ => "md",
    };

    /// <summary>Class-name token for a <see cref="Tone"/> — e.g. <c>danger</c>.</summary>
    public static string ToToken(this Tone tone) => tone switch
    {
        Tone.Danger => "danger",
        _ => "default",
    };

    /// <summary>Class-name token for a <see cref="TabScale"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this TabScale scale) => scale switch
    {
        TabScale.Lg => "lg",
        TabScale.Sm => "sm",
        TabScale.Xs => "xs",
        _ => "md",
    };

    /// <summary>Class-name token for a <see cref="ToggleSize"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this ToggleSize size) => size switch
    {
        ToggleSize.Sm => "sm",
        _ => "md",
    };

    /// <summary>Class-name token for a <see cref="TooltipPosition"/> — e.g. <c>bottom</c>.</summary>
    public static string ToToken(this TooltipPosition position) => position switch
    {
        TooltipPosition.Bottom => "bottom",
        TooltipPosition.Left => "left",
        TooltipPosition.Right => "right",
        _ => "top",
    };

    /// <summary>Class-name token for an <see cref="AvatarScale"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this AvatarScale scale) => scale switch
    {
        AvatarScale.Xs => "xs",
        AvatarScale.Sm => "sm",
        AvatarScale.Lg => "lg",
        _ => "md",
    };

    /// <summary>Class-name token for an <see cref="AvatarVariant"/> — e.g. <c>leading</c>.</summary>
    public static string ToToken(this AvatarVariant variant) => variant switch
    {
        AvatarVariant.Leading => "leading",
        AvatarVariant.None => "none",
        _ => "trailing",
    };

    /// <summary>Class-name token for a <see cref="ChipType"/> — e.g. <c>action</c>.</summary>
    public static string ToToken(this ChipType type) => type switch
    {
        ChipType.Tag => "tag",
        ChipType.Active => "active",
        ChipType.Action => "action",
        _ => "default",
    };

    /// <summary>Class-name token for a <see cref="MenuItemVariant"/> — e.g. <c>danger</c>.</summary>
    public static string ToToken(this MenuItemVariant variant) => variant switch
    {
        MenuItemVariant.Danger => "danger",
        _ => "default",
    };

    /// <summary>Class-name token for a <see cref="MenuPosition"/> — e.g. <c>bottom-end</c>.</summary>
    public static string ToToken(this MenuPosition position) => position switch
    {
        MenuPosition.BottomStart => "bottom-start",
        _ => "bottom-end",
    };

    /// <summary>Class-name token for a <see cref="ToastVariant"/> — e.g. <c>success</c>.</summary>
    public static string ToToken(this ToastVariant variant) => variant switch
    {
        ToastVariant.Success => "success",
        ToastVariant.Warning => "warning",
        ToastVariant.Error => "error",
        _ => "informative",
    };

    /// <summary>Class-name token for a <see cref="StatusTagVariant"/> — e.g. <c>warning</c>.</summary>
    public static string ToToken(this StatusTagVariant variant) => variant switch
    {
        StatusTagVariant.Neutral => "neutral",
        StatusTagVariant.Warning => "warning",
        StatusTagVariant.Error => "error",
        _ => "success",
    };

    /// <summary>Class-name token for a <see cref="LucentButtonVariant"/> — e.g. <c>on-glass</c>.</summary>
    public static string ToToken(this LucentButtonVariant variant) => variant switch
    {
        LucentButtonVariant.Secondary => "secondary",
        LucentButtonVariant.Ghost => "ghost",
        LucentButtonVariant.OnGlass => "on-glass",
        LucentButtonVariant.Danger => "danger",
        LucentButtonVariant.Text => "text",
        _ => "primary",
    };

    /// <summary>Class-name token for a <see cref="BadgeVariant"/> — e.g. <c>accent</c>.</summary>
    public static string ToToken(this BadgeVariant variant) => variant switch
    {
        BadgeVariant.Accent => "accent",
        BadgeVariant.Error => "error",
        BadgeVariant.Success => "success",
        _ => "neutral",
    };

    /// <summary>Class-name token for a <see cref="BadgeKind"/> — e.g. <c>count</c>.</summary>
    public static string ToToken(this BadgeKind kind) => kind switch
    {
        BadgeKind.Count => "count",
        BadgeKind.Dot => "dot",
        _ => "label",
    };

    /// <summary>Class-name token for a <see cref="SpinnerSize"/> — e.g. <c>md</c>.</summary>
    public static string ToToken(this SpinnerSize size) => size switch
    {
        SpinnerSize.Sm => "sm",
        SpinnerSize.Lg => "lg",
        _ => "md",
    };

    /// <summary>Class-name token for a <see cref="SkeletonShape"/> — e.g. <c>circle</c>.</summary>
    public static string ToToken(this SkeletonShape shape) => shape switch
    {
        SkeletonShape.Circle => "circle",
        SkeletonShape.Block => "block",
        _ => "line",
    };

    /// <summary>Class-name token for an <see cref="InlineNoticeVariant"/> — e.g. <c>warning</c>.</summary>
    public static string ToToken(this InlineNoticeVariant variant) => variant switch
    {
        InlineNoticeVariant.Success => "success",
        InlineNoticeVariant.Warning => "warning",
        InlineNoticeVariant.Error => "error",
        _ => "info",
    };

    /// <summary>Default glyph for an <see cref="InlineNoticeVariant"/>.</summary>
    public static string DefaultIcon(this InlineNoticeVariant variant) => variant switch
    {
        InlineNoticeVariant.Success => "check_circle",
        InlineNoticeVariant.Warning => "warning",
        InlineNoticeVariant.Error => "error",
        _ => "info",
    };
}
