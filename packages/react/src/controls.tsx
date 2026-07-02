import { type ButtonHTMLAttributes, type ReactNode, createContext, useContext } from 'react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { ButtonVariant, ChipType, ControlSize, IconButtonSize, IconSize, SegmentedOption, ToggleSize } from './foundations';

// ─── Button ─────────────────────────────────────────────────────────────────────
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  /** Leading adornment (e.g. an Icon). */
  prefix?: ReactNode;
  /** Trailing adornment. */
  suffix?: ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', loading = false, disabled, type = 'button',
  prefix, suffix, children, className, ...rest
}: ButtonProps) {
  return (
    <span className={cx('lucent-button', `lucent-button--${variant}`, `lucent-button--${size}`, loading && 'is-loading', className)}>
      <button className="lucent-button__inner" type={type} disabled={disabled || loading} {...rest}>
        {loading ? (
          <span className="lucent-spinner" style={{ width: 18, height: 18 }} />
        ) : (
          <>
            {prefix}
            <span className="lucent-button__label">{children}</span>
            {suffix}
          </>
        )}
      </button>
    </span>
  );
}

// ─── Icon button ──────────────────────────────────────────────────────────────
const ICON_BTN_GLYPH: Record<IconButtonSize, IconSize> = { sm: 'sm', md: 'md', lg: 'lg' };

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: string;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function IconButton({
  icon, variant = 'primary', size = 'md', loading = false, disabled, ariaLabel, type = 'button', className, ...rest
}: IconButtonProps) {
  return (
    <span className={cx('lucent-icon-button', `lucent-icon-button--${variant}`, `lucent-icon-button--${size}`, loading && 'is-loading', className)}>
      <button className="lucent-icon-button__inner" type={type} disabled={disabled || loading} aria-label={ariaLabel || undefined} {...rest}>
        {loading ? <span className="lucent-spinner" /> : <Icon name={icon} size={ICON_BTN_GLYPH[size]} />}
      </button>
    </span>
  );
}

// ─── Toggle ─────────────────────────────────────────────────────────────────────
export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked = false, onChange, size = 'md', label = '', disabled = false, className }: ToggleProps) {
  const toggle = () => { if (!disabled) onChange?.(!checked); };
  return (
    <span
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={label || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx('lucent-toggle', `lucent-toggle--${size}`, checked && 'is-checked', disabled && 'is-disabled', className)}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
    >
      <span className="lucent-toggle__track"><span className="lucent-toggle__thumb" /></span>
      {label && <span className="lucent-toggle__label">{label}</span>}
    </span>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
export interface ChipProps {
  type?: ChipType;
  size?: ControlSize;
  label?: string;
  onClose?: () => void;
  className?: string;
}

export function Chip({ type = 'default', size = 'md', label = '', onClose, className }: ChipProps) {
  return (
    <span className={cx('lucent-chip', `lucent-chip--${type}`, `lucent-chip--${size}`, className)}>
      {type === 'tag' && <Icon name="tag" size="sm" />}
      <span className="lucent-chip__label">{label}</span>
      {type === 'action' && (
        <button type="button" className="lucent-chip__close" aria-label={label ? `Remove ${label}` : 'Remove'} onClick={onClose}>
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ControlSize;
  label?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked = false, onChange, size = 'md', label = '', indeterminate = false, disabled = false, className }: CheckboxProps) {
  const toggle = () => { if (!disabled) onChange?.(!checked); };
  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled || undefined}
      aria-label={label || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx('lucent-checkbox', `lucent-checkbox--${size}`, checked && 'is-checked', indeterminate && 'is-indeterminate', disabled && 'is-disabled', className)}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === ' ') { e.preventDefault(); toggle(); } }}
    >
      <span className="lucent-checkbox__box">
        {checked && !indeterminate && <Icon className="lucent-checkbox__icon lucent-checkbox__icon--check" name="check" size="sm" />}
        {indeterminate && <Icon className="lucent-checkbox__icon lucent-checkbox__icon--dash" name="remove" size="sm" />}
      </span>
      {label && <span className="lucent-checkbox__label">{label}</span>}
    </span>
  );
}

// ─── Radio group ──────────────────────────────────────────────────────────────
interface RadioContextValue {
  value: unknown;
  onChange: (value: unknown) => void;
  size: ControlSize;
  disabled: boolean;
  hasSelection: boolean;
}
const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps {
  value?: unknown;
  onChange?: (value: unknown) => void;
  size?: ControlSize;
  disabled?: boolean;
  label?: string;
  children?: ReactNode;
  className?: string;
}

/** Container that owns the selected value and shared density for its `<Radio>` children. */
export function RadioGroup({ value, onChange, size = 'md', disabled = false, label, children, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={label || undefined} className={cx('lucent-radio-group', className)}>
      <RadioContext.Provider
        value={{ value, onChange: (v) => onChange?.(v), size, disabled, hasSelection: value != null }}
      >
        {children}
      </RadioContext.Provider>
    </div>
  );
}

export interface RadioProps {
  value: unknown;
  label?: string;
  /** Per-radio density override; otherwise inherits the group's `size`. */
  size?: ControlSize;
  disabled?: boolean;
  className?: string;
}

/** A single radio button. Must be rendered inside a `<RadioGroup>`. */
export function Radio({ value, label = '', size, disabled = false, className }: RadioProps) {
  const ctx = useContext(RadioContext);
  const checked = ctx ? ctx.value === value : false;
  const isDisabled = disabled || (ctx?.disabled ?? false);
  const effSize = size ?? ctx?.size ?? 'md';
  const select = () => { if (!isDisabled) ctx?.onChange(value); };
  return (
    <span
      role="radio"
      aria-checked={checked}
      aria-disabled={isDisabled || undefined}
      aria-label={label || undefined}
      tabIndex={isDisabled ? -1 : (checked || !ctx?.hasSelection ? 0 : -1)}
      className={cx('lucent-radio', `lucent-radio--${effSize}`, checked && 'is-checked', isDisabled && 'is-disabled', className)}
      onClick={select}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(); } }}
    >
      <span className="lucent-radio__circle" />
      {label && <span className="lucent-radio__label">{label}</span>}
    </span>
  );
}

// ─── Segmented control ────────────────────────────────────────────────────────
export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: unknown;
  onChange?: (value: unknown) => void;
  size?: ControlSize;
  label?: string;
  className?: string;
}

/** A compact inline single-select for a view/mode among a few peers (Day/Week/Month). */
export function SegmentedControl({ options, value, onChange, size = 'md', label, className }: SegmentedControlProps) {
  return (
    <div
      role="group"
      aria-label={label || undefined}
      className={cx('lucent-segmented-control', `lucent-segmented-control--${size}`, className)}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={i}
            type="button"
            className={cx('lucent-segmented-control__segment', selected && 'is-selected')}
            aria-pressed={selected}
            disabled={opt.disabled}
            onClick={() => { if (!opt.disabled) onChange?.(opt.value); }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
