import { type ReactNode, useState } from 'react';
import {
  autoUpdate, flip, FloatingPortal, offset, shift,
  useDismiss, useFloating, useFocus, useHover, useInteractions, useRole,
} from '@floating-ui/react';
import { cx } from './cx';
import type { BadgeKind, BadgeVariant, IconSize, StatusTagVariant, TooltipPosition } from './foundations';

// ─── Icon ─────────────────────────────────────────────────────────────────────
export interface IconProps {
  /** Material Icons ligature name (e.g. `settings`, `more_vert`). */
  name: string;
  size?: IconSize;
  /** Set only when the icon conveys meaning on its own. Leave undefined for decorative icons. */
  ariaLabel?: string;
  className?: string;
}

export function Icon({ name, size = 'md', ariaLabel, className }: IconProps) {
  const meaningful = !!ariaLabel;
  return (
    <span
      className={cx('lucent-icon', `lucent-icon--${size}`, className)}
      aria-hidden={meaningful ? undefined : true}
      role={meaningful ? 'img' : undefined}
      aria-label={meaningful ? ariaLabel : undefined}
    >
      <span className="material-icons lucent-icon__glyph">{name}</span>
    </span>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
export function Tag({ children, className }: { children?: ReactNode; className?: string }) {
  return <span className={cx('lucent-tag', className)}>{children}</span>;
}

// ─── Status tag ─────────────────────────────────────────────────────────────────
export interface StatusTagProps {
  variant?: StatusTagVariant;
  label?: string;
  className?: string;
}

export function StatusTag({ variant = 'success', label = '', className }: StatusTagProps) {
  return (
    <span className={cx('lucent-status-tag', `lucent-status-tag--${variant}`, className)}>
      <span>{label}</span>
    </span>
  );
}

// ─── Badge ──────────────────────────────────────────────────────────────────────
export interface BadgeProps {
  variant?: BadgeVariant;
  kind?: BadgeKind;
  /** Shorthand for the count/label text; `children` overrides it. Ignored for `dot`. */
  label?: string;
  children?: ReactNode;
  className?: string;
}

/** A small status indicator — unread count, short label ("AI"), or a bare presence dot. */
export function Badge({ variant = 'neutral', kind = 'label', label = '', children, className }: BadgeProps) {
  return (
    <span
      className={cx('lucent-badge', `lucent-badge--${kind}`, `lucent-badge--${variant}`, className)}
      aria-hidden={kind === 'dot' ? true : undefined}
    >
      {kind === 'dot' ? null : (children ?? label)}
    </span>
  );
}

// ─── Tooltip ────────────────────────────────────────────────────────────────────
export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  children: ReactNode;
}

/** Accessible tooltip. Wraps a trigger; shows the bubble on hover/focus via Floating UI. */
export function Tooltip({ content, position = 'top', children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: position,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} style={{ display: 'inline-flex' }}>
        {children}
      </span>
      {open && content && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="lucent-tooltip"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
