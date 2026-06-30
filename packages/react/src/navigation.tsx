import { type ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { BreadcrumbItem } from './foundations';

// ─── Nav icon ───────────────────────────────────────────────────────────────────
export interface NavIconProps {
  name: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function NavIcon({ name, active = false, disabled = false, ariaLabel, onClick, className }: NavIconProps) {
  return (
    <button
      type="button"
      className={cx('lucent-nav-icon', active && 'is-active', disabled && 'is-disabled', className)}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel || undefined}
      title={ariaLabel || undefined}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={name} size="lg" />
    </button>
  );
}

// ─── Nav rail ───────────────────────────────────────────────────────────────────
export function NavRail({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('lucent-nav-rail', className)}>{children}</div>;
}

// ─── Nav divider ──────────────────────────────────────────────────────────────
export function NavDivider({ className }: { className?: string }) {
  return <div className={cx('lucent-nav-divider', className)} role="separator" />;
}

// ─── Activity bar ─────────────────────────────────────────────────────────────
export function ActivityBar({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('lucent-activity-bar', className)}>{children}</div>;
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
}

export function Breadcrumbs({ items, onItemClick, className }: BreadcrumbsProps) {
  return (
    <nav className={cx('lucent-breadcrumbs', className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label + i}>
            <span
              className={cx('lucent-breadcrumbs__item', last && 'is-last')}
              onClick={() => { if (!last) onItemClick?.(item); }}
            >
              {item.label}
            </span>
            {!last && <span className="lucent-breadcrumbs__sep" aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
