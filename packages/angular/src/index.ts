// ─── Foundations ──────────────────────────────────────────────────────────────
export type { ControlSize } from './sizing';
export type { Tone } from './tone';

// ─── Slot markers (content-projection directives) ─────────────────────────────
export { LucentLabel, LucentHint, LucentError, LucentPrefix, LucentSuffix, LucentLeading, LucentTrailing, LucentSupporting, LucentModalHeader, LucentModalActions } from './slots/slots';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { LucentIcon } from './icon/icon';
export type { IconSize } from './icon/icon';

export { LucentTag } from './tag/tag';

export { LucentStatusTag } from './status-tag/status-tag';
export type { StatusTagVariant } from './status-tag/status-tag';

export { LucentBadge } from './badge/badge';
export type { BadgeVariant, BadgeKind } from './badge/badge';

export { LucentTooltip } from './tooltip/tooltip';
export type { TooltipPosition } from './tooltip/tooltip';

// ─── Tier 2 — Interactive ─────────────────────────────────────────────────────
export { LucentButton } from './button/button';
export type { ButtonVariant } from './button/button';

export { LucentIconButton } from './icon-button/icon-button';
export type { IconButtonSize } from './icon-button/icon-button';

export { LucentToggle } from './toggle/toggle';
export type { ToggleSize } from './toggle/toggle';

export { LucentChip } from './chip/chip';
export type { ChipType } from './chip/chip';

export { LucentCheckbox } from './checkbox/checkbox';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────
export { LucentNavIcon } from './nav-icon/nav-icon';

export { LucentNavRail } from './nav-rail/nav-rail';

export { LucentNavDivider } from './nav-divider/nav-divider';

export { LucentActivityBar } from './activity-bar/activity-bar';

export { LucentBreadcrumbs } from './breadcrumbs/breadcrumbs';
export type { BreadcrumbItem } from './breadcrumbs/breadcrumbs';

// ─── Tier 4 — Form inputs ─────────────────────────────────────────────────────
export { LucentAvatar } from './avatar/avatar';
export type { AvatarScale, AvatarVariant } from './avatar/avatar';

export { LucentTextInput } from './text-input/text-input';

export { LucentInlineInput } from './inline-input/inline-input';

export { LucentOption } from './option/option';

export { LucentSelect } from './select/select';
export type { SelectOption } from './select/select';

// ─── Tier 5 — Data display ───────────────────────────────────────────────────

export { LucentListItem } from './list-item/list-item';

export { LucentList } from './list/list';

// ─── Tier 6 — Containers ─────────────────────────────────────────────────────

export { LucentTab } from './tab/tab';
export type { TabScale } from './tab/tab';

export { LucentTabList } from './tab-list/tab-list';

export { LucentCard } from './card/card';

export { LucentMenu } from './menu/menu';
export { LucentMenuTrigger } from './menu/menu-trigger';
export { LucentMenuItem } from './menu-item/menu-item';
export type { MenuItemVariant } from './menu-item/menu-item';
export { LucentMenuDivider } from './menu-divider/menu-divider';

// ─── Tier 7 — Feedback ────────────────────────────────────────────────────────

export { LucentSpinner } from './spinner/spinner';
export type { SpinnerSize } from './spinner/spinner';

export { LucentSkeleton } from './skeleton/skeleton';
export type { SkeletonShape } from './skeleton/skeleton';

// ─── Tier 7 — Overlays & feedback ────────────────────────────────────────────

export { LucentToast } from './toast/toast';
export type { ToastVariant } from './toast/toast';

export { LucentSnackbar } from './snackbar/snackbar';

export { LucentModal } from './modal/modal';
export type { ModalVariant } from './modal/modal';

// ─── Services (imperative overlays) ──────────────────────────────────────────

export { ToastService } from './notifications/toast.service';
export type { ToastOptions } from './notifications/toast.service';

export { SnackbarService } from './notifications/snackbar.service';
export type { SnackbarOptions } from './notifications/snackbar.service';

export { DialogService, DialogRef, DIALOG_DATA } from './dialog/dialog.service';
export type { ConfirmOptions } from './dialog/dialog.service';
