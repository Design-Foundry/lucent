// ─── Foundations ──────────────────────────────────────────────────────────────
export type { ControlSize } from './sizing';
export type { Tone } from './tone';

// ─── Slot markers (content-projection directives) ─────────────────────────────
export { DfLabel, DfHint, DfError, DfPrefix, DfSuffix, DfLeading, DfTrailing, DfSupporting, DfModalHeader, DfModalActions } from './slots/slots';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { DfIcon } from './icon/icon';
export type { IconSize } from './icon/icon';

export { DfTag } from './tag/tag';

export { DfStatusTag } from './status-tag/status-tag';
export type { StatusTagVariant } from './status-tag/status-tag';

export { DfTooltip } from './tooltip/tooltip';
export type { TooltipPosition } from './tooltip/tooltip';

// ─── Tier 2 — Interactive ─────────────────────────────────────────────────────
export { DfButton } from './button/button';
export type { ButtonVariant } from './button/button';

export { DfIconButton } from './icon-button/icon-button';
export type { IconButtonSize } from './icon-button/icon-button';

export { DfToggle } from './toggle/toggle';
export type { ToggleSize } from './toggle/toggle';

export { DfChip } from './chip/chip';
export type { ChipType } from './chip/chip';

export { DfCheckbox } from './checkbox/checkbox';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────
export { DfNavIcon } from './nav-icon/nav-icon';

export { DfNavRail } from './nav-rail/nav-rail';

export { DfNavDivider } from './nav-divider/nav-divider';

export { DfActivityBar } from './activity-bar/activity-bar';

export { DfBreadcrumbs } from './breadcrumbs/breadcrumbs';
export type { BreadcrumbItem } from './breadcrumbs/breadcrumbs';

// ─── Tier 4 — Form inputs ─────────────────────────────────────────────────────
export { DfAvatar } from './avatar/avatar';
export type { AvatarScale, AvatarVariant } from './avatar/avatar';

export { DfInput } from './input/input';

export { DfInlineInput } from './inline-input/inline-input';

export { DfOption } from './option/option';

export { DfSelect } from './select/select';
export type { SelectOption } from './select/select';

// ─── Tier 5 — Data display ───────────────────────────────────────────────────

export { DfListItem } from './list-item/list-item';

export { DfList } from './list/list';

// ─── Tier 6 — Containers ─────────────────────────────────────────────────────

export { DfTab } from './tab/tab';
export type { TabScale } from './tab/tab';

export { DfTabList } from './tab-list/tab-list';

export { DfCard } from './card/card';

export { DfMenu } from './menu/menu';
export { DfMenuTrigger } from './menu/menu-trigger';
export { DfMenuItem } from './menu-item/menu-item';
export type { MenuItemVariant } from './menu-item/menu-item';
export { DfMenuDivider } from './menu-divider/menu-divider';

// ─── Tier 7 — Overlays & feedback ────────────────────────────────────────────

export { DfToast } from './toast/toast';
export type { ToastVariant } from './toast/toast';

export { DfSnackbar } from './snackbar/snackbar';

export { DfModal } from './modal/modal';
export type { ModalVariant } from './modal/modal';

// ─── Services (imperative overlays) ──────────────────────────────────────────

export { ToastService } from './notifications/toast.service';
export type { ToastOptions } from './notifications/toast.service';

export { SnackbarService } from './notifications/snackbar.service';
export type { SnackbarOptions } from './notifications/snackbar.service';

export { DialogService, DialogRef, DIALOG_DATA } from './dialog/dialog.service';
export type { ConfirmOptions } from './dialog/dialog.service';
