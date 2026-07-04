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
/** @deprecated Use `<Divider variant="plain" />` (the unified Divider) instead. */
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
    <nav className={cx('lucent-breadcrumbs', className)} aria-label="Breadcrumb">
      <ol className="lucent-breadcrumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label + i} className="lucent-breadcrumbs__crumb">
              {/* A crumb with a path is a real link (works without JS, middle-click, etc.);
                  otherwise it stays a click-emitting span for programmatic navigation. */}
              {!last && item.path ? (
                <a className="lucent-breadcrumbs__item" href={item.path}>
                  {item.label}
                </a>
              ) : (
                <span
                  className={cx('lucent-breadcrumbs__item', last && 'is-last')}
                  aria-current={last ? 'page' : undefined}
                  onClick={() => { if (!last) onItemClick?.(item); }}
                >
                  {item.label}
                </span>
              )}
              {!last && <span className="lucent-breadcrumbs__sep" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
