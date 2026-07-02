import { type CSSProperties, type ReactNode, useMemo } from 'react';
import {
  FloatingFocusManager, FloatingOverlay, FloatingPortal,
  useDismiss, useFloating, useInteractions, useRole,
} from '@floating-ui/react';
import { cx } from './cx';
import { Icon } from './primitives';
import { Button, IconButton } from './controls';
import type { ModalVariant, SkeletonShape, SpinnerSize, ToastVariant } from './foundations';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export interface SpinnerProps {
  size?: SpinnerSize;
  /** Accessible name announced to assistive tech. Defaults to "Loading". */
  label?: string;
  className?: string;
}

/** A rotating ring for indeterminate waits. Standalone form is accent-coloured. */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <span
      className={cx('lucent-spinner', `lucent-spinner--${size}`, className)}
      role="status"
      aria-label={label}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export interface SkeletonProps {
  shape?: SkeletonShape;
  className?: string;
  style?: CSSProperties;
}

/** A shimmering placeholder that holds layout while real content loads. Decorative. */
export function Skeleton({ shape = 'line', className, style }: SkeletonProps) {
  return (
    <span
      className={cx('lucent-skeleton', `lucent-skeleton--${shape}`, className)}
      style={style}
      aria-hidden
    />
  );
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface ProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  /** Accessible name for the bar (e.g. "Uploading"). */
  label?: string;
  className?: string;
}

/** A linear progress bar — determinate (value/max) or a sliding indeterminate sliver. */
export function Progress({ value = 0, max = 100, indeterminate = false, label, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / (max || 100)) * 100));
  return (
    <span
      className={cx('lucent-progress', indeterminate && 'lucent-progress--indeterminate', className)}
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={label}
    >
      <span className="lucent-progress__bar" style={indeterminate ? undefined : { width: `${pct}%` }} />
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
let modalSeq = 0;

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  /** Override the default title/subtitle header. */
  header?: ReactNode;
  /** Override the default variant-driven footer. */
  actions?: ReactNode;
  children?: ReactNode;
}

export function Modal({
  open, onOpenChange, title = '', subtitle = '', variant = 'informative',
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, onClose,
  header, actions, children,
}: ModalProps) {
  const titleId = useMemo(() => `lucent-modal-${modalSeq++}-title`, []);
  const { refs, context } = useFloating({ open, onOpenChange });
  const { getFloatingProps } = useInteractions([
    useDismiss(context, { outsidePress: true, escapeKey: true }),
    useRole(context, { role: 'dialog' }),
  ]);

  const hasFooter = !!actions || variant !== 'informative';
  const isDestructive = variant === 'destructive';

  const close = () => { onClose?.(); onOpenChange(false); };
  const cancel = () => { onCancel?.(); onOpenChange(false); };
  const confirm = () => { onConfirm?.(); onOpenChange(false); };

  if (!open) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay className="lucent-modal__scrim" lockScroll style={{ display: 'grid', placeItems: 'center' }}>
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            className="lucent-modal"
            aria-labelledby={title ? titleId : undefined}
            {...getFloatingProps()}
          >
            <div className="lucent-modal__header">
              {header ? (
                <div className="lucent-modal__heading">{header}</div>
              ) : (
                <div className="lucent-modal__heading">
                  <span className="lucent-modal__title" id={titleId}>{title}</span>
                  {subtitle && <p className="lucent-modal__subtitle">{subtitle}</p>}
                </div>
              )}
              <IconButton icon="close" variant="ghost" size="sm" ariaLabel="Close" onClick={close} />
            </div>

            <div className="lucent-modal__body">{children}</div>

            {hasFooter && (
              <div className="lucent-modal__footer">
                {actions ?? (
                  <>
                    <Button variant="ghost" onClick={cancel}>{cancelLabel}</Button>
                    <Button variant={isDestructive ? 'danger' : 'primary'} onClick={confirm}>{confirmLabel}</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}

// ─── Snackbar ───────────────────────────────────────────────────────────────────
export interface SnackbarProps {
  message?: string;
  icon?: string;
  showIcon?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function Snackbar({ message = '', icon = 'widgets', showIcon = true, actionLabel = '', onAction, className }: SnackbarProps) {
  return (
    <div className={cx('lucent-snackbar', className)}>
      <div className="lucent-snackbar__content">
        {showIcon && <Icon name={icon} size="md" className="lucent-snackbar__icon" />}
        <span className="lucent-snackbar__message">{message}</span>
      </div>
      {actionLabel && <Button variant="ghost" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface ToastProps {
  title?: string;
  message?: string;
  variant?: ToastVariant;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Toast({ title = '', message = '', variant = 'informative', closable = true, onClose, className }: ToastProps) {
  return (
    <div role="status" aria-live="polite" className={cx('lucent-toast', `lucent-toast--${variant}`, className)}>
      <div className="lucent-toast__header">
        <span className="lucent-toast__title">{title}</span>
        {closable && (
          <IconButton className="lucent-toast__close" icon="close" variant="ghost" size="sm" ariaLabel="Dismiss" onClick={onClose} />
        )}
      </div>
      {message && <p className="lucent-toast__message">{message}</p>}
    </div>
  );
}
