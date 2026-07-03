// ─── Foundations ──────────────────────────────────────────────────────────────
export type {
  ControlSize, Tone, IconSize, ButtonVariant, IconButtonSize, StatusTagVariant,
  TooltipPosition, ToggleSize, ChipType, AvatarScale, AvatarVariant, TabScale,
  MenuItemVariant, MenuPosition, ModalVariant, ToastVariant, BreadcrumbItem, SelectOption,
} from './foundations';
export { cx } from './cx';
export { LucentElement, LucentSurface } from './base';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { LucentIcon, LucentTag, LucentStatusTag, LucentBadge, LucentDivider } from './primitives';

// ─── Tier 2 — Actions & controls ──────────────────────────────────────────────
export { LucentButton, LucentIconButton, LucentToggle, LucentChip, LucentCheckbox, LucentRadioGroup, LucentRadio, LucentSegmentedControl } from './controls';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────
export { LucentNavIcon, LucentNavRail, LucentNavDivider, LucentActivityBar, LucentBreadcrumbs } from './navigation';

// ─── Tier 4 — Inputs & data entry ───────────────────────────────────────────────
export { LucentAvatar, LucentInlineInput, LucentTextInput, LucentTextarea, LucentOption } from './inputs';

// ─── Tier 5 — Data display ──────────────────────────────────────────────────────
export { LucentList, LucentListItem } from './data-display';

// ─── Tier 6 — Containers ──────────────────────────────────────────────────────
export { LucentCard, LucentTab, LucentTabList, LucentMenu, LucentMenuItem, LucentMenuDivider, LucentAccordion } from './containers';

// ─── Tier 7 — Overlays & feedback ─────────────────────────────────────────────
export { LucentSpinner, LucentSkeleton, LucentProgress, LucentInlineNotice, LucentSnackbar, LucentToast, LucentModal } from './feedback';
export { LucentTooltip, LucentSelect, LucentMenuTrigger } from './overlays';

// ─── Tier 8 — Messaging & conversation ────────────────────────────────────────
export { LucentReferenceTag, LucentMessageBubble, LucentTypingIndicator, LucentCodeBlock, LucentPromptSuggestion, LucentComposer, LucentChatTrigger, LucentConversationRow, LucentJumpToLatest } from './messaging';

// ─── Tier 9 — Temporal (date & time) ──────────────────────────────────────────
export { LucentCalendar, LucentDatePicker, LucentDateRangePicker, LucentTimePicker } from './temporal';
export type { Time } from './temporal';

// ─── Tier 10 — Scheduler (event parts) ────────────────────────────────────────
export { LucentEventChip, LucentMonthCell, LucentEventBlock, LucentAgendaRow } from './scheduler';
export type { EventCategory, SchedulerEvent } from './scheduler';

// ─── Tier 11 — Scheduler views (Month / Week / Agenda) ────────────────────────
export { LucentSchedulerMonth, LucentSchedulerWeek, LucentSchedulerAgenda } from './scheduler-views';
export type { DatedEvent, TimedEvent } from './scheduler-views';

// ─── Tier 12 — DAW (audio-workstation controls) ───────────────────────────────
export { LucentKnob, LucentFader } from './daw';
