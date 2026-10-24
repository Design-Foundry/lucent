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

export { LucentDivider } from './divider/divider';
export type { DividerVariant } from './divider/divider';

export { LucentTooltip } from './tooltip/tooltip';
export type { TooltipPosition } from './tooltip/tooltip';

// ─── Tier 2 — Interactive ─────────────────────────────────────────────────────
export { LucentButton } from './button/button';
export type { ButtonVariant, ButtonTone } from './button/button';

export { LucentIconButton } from './icon-button/icon-button';
export type { IconButtonSize } from './icon-button/icon-button';

export { LucentToggle } from './toggle/toggle';
export type { ToggleSize } from './toggle/toggle';

export { LucentChip } from './chip/chip';
export type { ChipType } from './chip/chip';

export { LucentCheckbox } from './checkbox/checkbox';

export { LucentRadio } from './radio/radio';
export { LucentRadioGroup } from './radio/radio-group';

export { LucentSegmentedControl } from './segmented-control/segmented-control';
export type { SegmentedOption } from './segmented-control/segmented-control';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────

export { LucentNavItem } from './nav-item/nav-item';
export { LucentNavGroup } from './nav-group/nav-group';
export { LucentNavRail } from './nav-rail/nav-rail';


export { LucentActivityBar } from './activity-bar/activity-bar';

export { LucentBreadcrumbs } from './breadcrumbs/breadcrumbs';
export type { BreadcrumbItem } from './breadcrumbs/breadcrumbs';
export { LucentSpaLink } from './spa-link/spa-link';

// ─── Tier 4 — Form inputs ─────────────────────────────────────────────────────
export { LucentAvatar } from './avatar/avatar';
export type { AvatarScale, AvatarVariant } from './avatar/avatar';

export { LucentTextInput } from './text-input/text-input';

export { LucentTextarea } from './textarea/textarea';

export { LucentInlineInput } from './inline-input/inline-input';

export { LucentOption } from './option/option';

export { LucentSelect } from './select/select';
export type { SelectOption } from './select/select';

// ─── Tier 5 — Data display ───────────────────────────────────────────────────

export { LucentListItem } from './list-item/list-item';

export { LucentList } from './list/list';

export { LucentTable } from './table/table';

// ─── Tier 6 — Containers ─────────────────────────────────────────────────────

export { LucentTab } from './tab/tab';
export type { TabScale } from './tab/tab';

export { LucentTabList } from './tab-list/tab-list';

export { LucentCard } from './card/card';

export { LucentMenu } from './menu/menu';
export { LucentMenuTrigger } from './menu/menu-trigger';
export { LucentMenuItem } from './menu-item/menu-item';
export type { MenuItemVariant } from './menu-item/menu-item';

export { LucentAccordion } from './accordion/accordion';

// ─── Tier 7 — Feedback ────────────────────────────────────────────────────────

export { LucentSpinner } from './spinner/spinner';
export type { SpinnerSize } from './spinner/spinner';

export { LucentSkeleton } from './skeleton/skeleton';
export type { SkeletonShape } from './skeleton/skeleton';

export { LucentProgress } from './progress/progress';

export { LucentInlineNotice } from './inline-notice/inline-notice';
export type { InlineNoticeVariant } from './inline-notice/inline-notice';

// ─── Tier 7 — Overlays & feedback ────────────────────────────────────────────

export { LucentToast } from './toast/toast';
export type { ToastVariant } from './toast/toast';

export { LucentSnackbar } from './snackbar/snackbar';

export { LucentModal } from './modal/modal';
export type { ModalVariant } from './modal/modal';

// ─── Tier 8 — Messaging & conversation ───────────────────────────────────────

export { LucentReferenceTag } from './reference-tag/reference-tag';
export type { ReferenceKind } from './reference-tag/reference-tag';

export { LucentMessageBubble } from './message-bubble/message-bubble';
export type { MessageRole, MessageGroup } from './message-bubble/message-bubble';

export { LucentTypingIndicator } from './typing-indicator/typing-indicator';
export type { TypingVariant } from './typing-indicator/typing-indicator';

export { LucentCodeBlock } from './code-block/code-block';

export { LucentPromptSuggestion } from './prompt-suggestion/prompt-suggestion';
export type { PromptSuggestionVariant } from './prompt-suggestion/prompt-suggestion';

export { LucentComposer } from './composer/composer';

export { LucentChatTrigger } from './chat-trigger/chat-trigger';

export { LucentConversationRow } from './conversation-row/conversation-row';

export { LucentJumpToLatest } from './jump-to-latest/jump-to-latest';

// ─── Tier 9 — Temporal (date & time) ─────────────────────────────────────────

export { LucentCalendar } from './calendar/calendar';
export type { CalendarMode } from './calendar/calendar';

export { LucentDatePicker } from './date-picker/date-picker';

export { LucentDateRangePicker } from './date-range-picker/date-range-picker';
export type { DateRange } from './date-range-picker/date-range-picker';

export { LucentTimePicker } from './time-picker/time-picker';
export type { Time } from './time-picker/time-picker';

// ─── Tier 10 — Scheduler (event parts) ────────────────────────────────────────

export { LucentEventChip, LucentMonthCell, LucentEventBlock, LucentAgendaRow } from './scheduler/scheduler';
export type { EventCategory, SchedulerEvent } from './scheduler/scheduler';

// ─── Tier 11 — Scheduler views (Month / Week / Agenda) ────────────────────────

export { LucentSchedulerMonth, LucentSchedulerWeek, LucentSchedulerAgenda } from './scheduler-views/scheduler-views';
export type { DatedEvent, TimedEvent } from './scheduler-views/scheduler-views';

// ─── Services (imperative overlays) ──────────────────────────────────────────

export { ToastService } from './notifications/toast.service';
export type { ToastOptions } from './notifications/toast.service';

export { SnackbarService } from './notifications/snackbar.service';
export type { SnackbarOptions } from './notifications/snackbar.service';

export { DialogService, DialogRef, DIALOG_DATA } from './dialog/dialog.service';
export type { ConfirmOptions } from './dialog/dialog.service';
