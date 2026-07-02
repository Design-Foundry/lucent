import { type KeyboardEvent, type ReactNode, type TableHTMLAttributes } from 'react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { Tone } from './foundations';

// ─── List ─────────────────────────────────────────────────────────────────────
export function List({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('lucent-list', className)}>{children}</div>;
}

// ─── Table ──────────────────────────────────────────────────────────────────────
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

/** Styles a native `<table>` with the Lucent contract. Author normal thead/tbody/tr/th/td. */
export function Table({ children, className, ...rest }: TableProps) {
  return <table className={cx('lucent-table', className)} {...rest}>{children}</table>;
}

// ─── List item ──────────────────────────────────────────────────────────────────
export interface ListItemProps {
  /** Primary text — overridden by `children`. */
  label?: string;
  /** Leading-icon shorthand — overridden by `leading`. */
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  /** Adds role="button" + keyboard activation. Set false for a static row. */
  interactive?: boolean;
  tone?: Tone;
  onActivate?: () => void;
  leading?: ReactNode;
  supporting?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function ListItem({
  label = '', icon = '', selected = false, disabled = false, interactive = true,
  tone = 'default', onActivate, leading, supporting, trailing, children, className,
}: ListItemProps) {
  const activate = () => { if (interactive && !disabled) onActivate?.(); };
  const onKey = (e: KeyboardEvent) => {
    if (!interactive || disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
  };

  return (
    <div
      className={cx('lucent-list-item', selected && 'is-selected', disabled && 'is-disabled',
        interactive && 'is-interactive', tone === 'danger' && 'is-danger', className)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={activate}
      onKeyDown={onKey}
    >
      {icon && !leading && <Icon className="lucent-list-item__icon" name={icon} size="sm" />}
      {leading}
      <span className="lucent-list-item__content">
        <span className="lucent-list-item__primary">{children ?? label}</span>
        {supporting && <span className="lucent-list-item__supporting">{supporting}</span>}
      </span>
      {trailing}
    </div>
  );
}
