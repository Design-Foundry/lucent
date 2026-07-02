import { type ReactNode, useMemo, useRef, useState } from 'react';
import {
  autoUpdate, flip, FloatingFocusManager, FloatingList, FloatingPortal, offset, size,
  useClick, useDismiss, useFloating, useInteractions, useListItem, useListNavigation, useRole,
} from '@floating-ui/react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { AvatarScale, AvatarVariant, ControlSize, SelectOption } from './foundations';

// ─── Avatar ─────────────────────────────────────────────────────────────────────
export interface AvatarProps {
  src?: string;
  name?: string;
  tenant?: string;
  scale?: AvatarScale;
  variant?: AvatarVariant;
  className?: string;
}

export function Avatar({ src, name = '', tenant = '', scale = 'md', variant = 'trailing', className }: AvatarProps) {
  const initials = useMemo(
    () => name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
    [name],
  );
  const showTenant = !!tenant && (scale === 'md' || scale === 'lg');

  const labels = (
    <div className="lucent-avatar__labels">
      <span className="lucent-avatar__name">{name}</span>
      {showTenant && <span className="lucent-avatar__tenant">{tenant}</span>}
    </div>
  );

  return (
    <div className={cx('lucent-avatar', `lucent-avatar--${scale}`, `lucent-avatar--${variant}`, className)}>
      {variant === 'leading' && labels}
      <div className="lucent-avatar__circle">
        {src ? <img src={src} alt={name} /> : <span className="lucent-avatar__initials">{initials}</span>}
      </div>
      {variant === 'trailing' && labels}
    </div>
  );
}

// ─── Inline input ─────────────────────────────────────────────────────────────
export interface InlineInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Typography utility class controlling the field's font (e.g. `typography-heading`). */
  typography?: string;
  disabled?: boolean;
  className?: string;
}

export function InlineInput({ value, onChange, placeholder, typography, disabled, className }: InlineInputProps) {
  return (
    <span className={cx('lucent-inline-input', className)}>
      <input
        className={cx('lucent-inline-input__field', typography)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </span>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────────
let textInputSeq = 0;

export interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: ControlSize;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

export function TextInput({
  value = '', onChange, size = 'md', placeholder, type = 'text', readOnly = false, disabled = false,
  clearable = false, onClear, label, hint, error, prefix, suffix, className,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const id = useMemo(() => `lucent-text-input-${textInputSeq++}`, []);
  const messageId = `${id}-msg`;
  const hasError = !!error;

  const wrapperModifier =
    disabled ? 'lucent-text-input__wrapper--disabled'
    : readOnly ? 'lucent-text-input__wrapper--readonly'
    : hasError ? 'lucent-text-input__wrapper--error'
    : focused ? 'lucent-text-input__wrapper--focus'
    : value ? 'lucent-text-input__wrapper--filled'
    : '';

  return (
    <div className={cx('lucent-text-input', `lucent-text-input--${size}`, className)}>
      {label && <label className="lucent-text-input__label typography-caption" htmlFor={id}>{label}</label>}
      <div className={cx('lucent-text-input__wrapper', wrapperModifier)}>
        {prefix}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? messageId : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix}
        {clearable && value && !disabled && !readOnly && (
          <button type="button" className="lucent-text-input__clear" aria-label="Clear"
            onClick={() => { onChange?.(''); onClear?.(); }}>
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
      {(error || hint) && (
        <span className={cx('lucent-text-input__message', hasError && 'lucent-text-input__message--error')} id={messageId}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
let textareaSeq = 0;

export interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: ControlSize;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
}

/** Multi-line text field. Mirrors TextInput's states; resizes vertically. */
export function Textarea({
  value = '', onChange, size = 'md', placeholder, rows = 3, readOnly = false, disabled = false,
  label, hint, error, className,
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const id = useMemo(() => `lucent-textarea-${textareaSeq++}`, []);
  const messageId = `${id}-msg`;
  const hasError = !!error;

  const wrapperModifier =
    disabled ? 'lucent-textarea__wrapper--disabled'
    : readOnly ? 'lucent-textarea__wrapper--readonly'
    : hasError ? 'lucent-textarea__wrapper--error'
    : focused ? 'lucent-textarea__wrapper--focus'
    : value ? 'lucent-textarea__wrapper--filled'
    : '';

  return (
    <div className={cx('lucent-textarea', `lucent-textarea--${size}`, className)}>
      {label && <label className="lucent-textarea__label typography-caption" htmlFor={id}>{label}</label>}
      <div className={cx('lucent-textarea__wrapper', wrapperModifier)}>
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? messageId : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      {(error || hint) && (
        <span className={cx('lucent-textarea__message', hasError && 'lucent-textarea__message--error')} id={messageId}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

// ─── Option (listbox row used by Select) ────────────────────────────────────────
export interface OptionProps {
  label: string;
  selected?: boolean;
  active?: boolean;
  disabled?: boolean;
  id?: string;
  onSelect?: () => void;
}

// ─── Select ─────────────────────────────────────────────────────────────────────
let selectSeq = 0;

export interface SelectProps {
  value?: unknown;
  onChange?: (value: unknown) => void;
  options: SelectOption[];
  size?: ControlSize;
  placeholder?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
}

export function Select({
  value, onChange, options, size: ctrlSize = 'md', placeholder = 'Select an option',
  label, hint, error, className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ids = useMemo(() => `lucent-select-${selectSeq++}`, []);
  const hasError = !!error;

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : '';

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
        },
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([click, dismiss, role, listNav]);

  const triggerModifier =
    hasError ? 'lucent-select__trigger--error'
    : open ? 'lucent-select__trigger--focus'
    : value !== null && value !== undefined && value !== '' ? 'lucent-select__trigger--filled'
    : '';

  const choose = (i: number) => { onChange?.(options[i].value); setOpen(false); };

  return (
    <div className={cx('lucent-select', `lucent-select--${ctrlSize}`, className)}>
      {label && <span className="lucent-select__label typography-caption" id={`${ids}-label`}>{label}</span>}

      <button
        ref={refs.setReference}
        type="button"
        className={cx('lucent-select__trigger', triggerModifier)}
        aria-labelledby={label ? `${ids}-label` : undefined}
        aria-invalid={hasError || undefined}
        {...getReferenceProps()}
      >
        <span className={cx('lucent-select__value', !selectedLabel && 'is-placeholder')}>
          {selectedLabel || placeholder}
        </span>
        <Icon className={cx('lucent-select__caret', open && 'is-open')} name="arrow_drop_down" size="md" />
      </button>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className="lucent-select__dropdown"
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <FloatingList elementsRef={listRef}>
                {options.map((opt, i) => (
                  <SelectOptionRow
                    key={String(opt.value)}
                    label={opt.label}
                    selected={opt.value === value}
                    active={activeIndex === i}
                    getItemProps={getItemProps}
                    onSelect={() => choose(i)}
                  />
                ))}
              </FloatingList>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}

      {(error || hint) && (
        <span className={cx('lucent-select__message', hasError && 'lucent-select__message--error')} id={`${ids}-msg`}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

function SelectOptionRow({
  label, selected, active, getItemProps, onSelect,
}: {
  label: string;
  selected: boolean;
  active: boolean;
  getItemProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  onSelect: () => void;
}) {
  const { ref, index } = useListItem();
  return (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      tabIndex={active ? 0 : -1}
      className={cx('lucent-option', selected && 'is-selected', active && 'is-active')}
      {...getItemProps({
        onClick: onSelect,
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } },
      })}
      data-index={index}
    >
      <span className="lucent-option__label">{label}</span>
    </div>
  );
}

/** Standalone option (e.g. for custom listboxes). Select renders its own rows internally. */
export function Option({ label, selected, active, disabled, id, onSelect }: OptionProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cx('lucent-option', selected && 'is-selected', active && 'is-active', disabled && 'is-disabled')}
      onClick={() => { if (!disabled) onSelect?.(); }}
    >
      <span className="lucent-option__label">{label}</span>
    </div>
  );
}
