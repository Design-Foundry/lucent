// ─── Foundation token types ───────────────────────────────────────────────────
// Mirror packages/angular/src/{sizing,tone}.ts + the per-component variant unions.
// React emits the same `lucent-` class tokens, so a single CSS layer styles every kit.

/** Control density scale — every interactive control accepts this `size`. xs 24 · sm 28 · md 32 · lg 40. */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';

/** Action intent — orthogonal to visual variant and to the status scale. `danger` = destructive. */
export type Tone = 'default' | 'danger';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-glass' | 'danger' | 'text';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type StatusTagVariant = 'success' | 'neutral' | 'warning' | 'error';
export type BadgeVariant = 'accent' | 'error' | 'success' | 'neutral';
export type BadgeKind = 'count' | 'label' | 'dot';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type ToggleSize = 'md' | 'sm';
export type ChipType = 'tag' | 'default' | 'active' | 'action';
export type AvatarScale = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarVariant = 'trailing' | 'leading' | 'none';
export type TabScale = 'lg' | 'md' | 'sm' | 'xs';
export type MenuItemVariant = 'default' | 'danger';
export type MenuPosition = 'bottom-end' | 'bottom-start';
export type ModalVariant = 'informative' | 'confirmation' | 'interactive' | 'destructive';
export type ToastVariant = 'informative' | 'success' | 'warning' | 'error';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  data?: unknown;
}

export interface SelectOption {
  label: string;
  value: unknown;
}
