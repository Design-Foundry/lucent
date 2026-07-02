// ─── Foundations ──────────────────────────────────────────────────────────────
export type {
  ControlSize, Tone, IconSize, ButtonVariant, IconButtonSize, StatusTagVariant,
  TooltipPosition, ToggleSize, ChipType, AvatarScale, AvatarVariant, TabScale,
  MenuItemVariant, MenuPosition, ModalVariant, ToastVariant, BreadcrumbItem, SelectOption,
} from './foundations';
export { cx } from './cx';
export { LucentElement, LucentSurface } from './base';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { LucentIcon, LucentTag, LucentStatusTag, LucentBadge } from './primitives';

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
export { LucentReferenceTag, LucentMessageBubble, LucentTypingIndicator, LucentCodeBlock, LucentPromptSuggestion, LucentComposer, LucentChatTrigger } from './messaging';
