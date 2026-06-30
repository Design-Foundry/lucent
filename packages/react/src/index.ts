// ─── Foundations ──────────────────────────────────────────────────────────────
export type {
  ControlSize, Tone, IconSize, ButtonVariant, IconButtonSize, StatusTagVariant,
  TooltipPosition, ToggleSize, ChipType, AvatarScale, AvatarVariant, TabScale,
  MenuItemVariant, MenuPosition, ModalVariant, ToastVariant, BreadcrumbItem, SelectOption,
} from './foundations';
export { cx } from './cx';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { Icon, Tag, StatusTag, Tooltip } from './primitives';
export type { IconProps, StatusTagProps, TooltipProps } from './primitives';

// ─── Tier 2 — Actions & controls ──────────────────────────────────────────────
export { Button, IconButton, Toggle, Chip, Checkbox } from './controls';
export type { ButtonProps, IconButtonProps, ToggleProps, ChipProps, CheckboxProps } from './controls';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────
export { NavIcon, NavRail, NavDivider, ActivityBar, Breadcrumbs } from './navigation';
export type { NavIconProps, BreadcrumbsProps } from './navigation';

// ─── Tier 4 — Inputs & data entry ───────────────────────────────────────────────
export { Avatar, InlineInput, TextInput, Option, Select } from './inputs';
export type { AvatarProps, InlineInputProps, TextInputProps, OptionProps, SelectProps } from './inputs';

// ─── Tier 5 — Data display ──────────────────────────────────────────────────────
export { List, ListItem } from './data-display';
export type { ListItemProps } from './data-display';

// ─── Tier 6 — Containers ──────────────────────────────────────────────────────
export { Card, TabList, Tab, Menu, MenuItem, MenuDivider, MenuTrigger } from './containers';
export type { TabListProps, TabProps, MenuItemProps, MenuTriggerProps } from './containers';

// ─── Tier 7 — Overlays & feedback ─────────────────────────────────────────────
export { Modal, Snackbar, Toast } from './feedback';
export type { ModalProps, SnackbarProps, ToastProps } from './feedback';
