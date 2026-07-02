// ─── Foundations ──────────────────────────────────────────────────────────────
export type {
  ControlSize, Tone, IconSize, ButtonVariant, IconButtonSize, StatusTagVariant,
  BadgeVariant, BadgeKind, SpinnerSize, SkeletonShape,
  TooltipPosition, ToggleSize, ChipType, AvatarScale, AvatarVariant, TabScale,
  MenuItemVariant, MenuPosition, ModalVariant, ToastVariant, BreadcrumbItem, SelectOption,
  SegmentedOption,
} from './foundations';
export { cx } from './cx';

// ─── Tier 1 — Primitives ──────────────────────────────────────────────────────
export { Icon, Tag, StatusTag, Badge, Tooltip } from './primitives';
export type { IconProps, StatusTagProps, BadgeProps, TooltipProps } from './primitives';

// ─── Tier 2 — Actions & controls ──────────────────────────────────────────────
export { Button, IconButton, Toggle, Chip, Checkbox, RadioGroup, Radio, SegmentedControl } from './controls';
export type { ButtonProps, IconButtonProps, ToggleProps, ChipProps, CheckboxProps, RadioGroupProps, RadioProps, SegmentedControlProps } from './controls';

// ─── Tier 3 — Navigation ──────────────────────────────────────────────────────
export { NavIcon, NavRail, NavDivider, ActivityBar, Breadcrumbs } from './navigation';
export type { NavIconProps, BreadcrumbsProps } from './navigation';

// ─── Tier 4 — Inputs & data entry ───────────────────────────────────────────────
export { Avatar, InlineInput, TextInput, Textarea, Option, Select } from './inputs';
export type { AvatarProps, InlineInputProps, TextInputProps, TextareaProps, OptionProps, SelectProps } from './inputs';

// ─── Tier 5 — Data display ──────────────────────────────────────────────────────
export { List, ListItem, Table } from './data-display';
export type { ListItemProps, TableProps } from './data-display';

// ─── Tier 6 — Containers ──────────────────────────────────────────────────────
export { Card, TabList, Tab, Menu, MenuItem, MenuDivider, MenuTrigger, Accordion } from './containers';
export type { TabListProps, TabProps, MenuItemProps, MenuTriggerProps, AccordionProps } from './containers';

// ─── Tier 7 — Overlays & feedback ─────────────────────────────────────────────
export { Modal, Snackbar, Toast, Spinner, Skeleton, Progress } from './feedback';
export type { ModalProps, SnackbarProps, ToastProps, SpinnerProps, SkeletonProps, ProgressProps } from './feedback';
