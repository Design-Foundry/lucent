import { createContext, type ReactNode, useContext, useState } from 'react';
import {
  autoUpdate, flip, FloatingFocusManager, FloatingPortal, offset, shift,
  useClick, useDismiss, useFloating, useInteractions, useRole,
} from '@floating-ui/react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { MenuItemVariant, MenuPosition, TabScale } from './foundations';

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('lucent-card', className)}>{children}</div>;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
interface TabCtx { scale: TabScale; activeTab: string; onChange: (v: string) => void; }
const TabContext = createContext<TabCtx>({ scale: 'md', activeTab: '', onChange: () => {} });

export interface TabListProps {
  scale?: TabScale;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
}

export function TabList({ scale = 'md', activeTab = '', onTabChange, children, className }: TabListProps) {
  return (
    <div role="tablist" className={cx('lucent-tab-list', className)}>
      <TabContext.Provider value={{ scale, activeTab, onChange: onTabChange ?? (() => {}) }}>
        {children}
      </TabContext.Provider>
    </div>
  );
}

export interface TabProps {
  value?: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

export function Tab({ value = '', label = '', icon = '', disabled = false }: TabProps) {
  const { scale, activeTab, onChange } = useContext(TabContext);
  const active = value === activeTab;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      className={cx('lucent-tab', `lucent-tab--${scale}`, active && 'lucent-tab--active', disabled && 'lucent-tab--disabled')}
      onClick={() => { if (!disabled) onChange(value); }}
    >
      {icon && <Icon name={icon} size={scale === 'lg' ? 'lg' : 'md'} />}
      <span className="lucent-tab__label">{label}</span>
    </button>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
export function Menu({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('lucent-menu', className)} role="menu">{children}</div>;
}

export interface MenuItemProps {
  label?: string;
  icon?: string;
  active?: boolean;
  variant?: MenuItemVariant;
  onClick?: () => void;
}

export function MenuItem({ label = '', icon = '', active = false, variant = 'default', onClick }: MenuItemProps) {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      className={cx('lucent-menu-item', active && 'is-active', variant === 'danger' && 'is-danger')}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
    >
      {icon && <Icon name={icon} size="sm" className="lucent-menu-item__icon" />}
      <span className="lucent-menu-item__label">{label}</span>
    </div>
  );
}

export function MenuDivider({ className }: { className?: string }) {
  return <div className={cx('lucent-menu-divider', className)} role="separator" />;
}

// ─── Menu trigger (portals a Menu on click) ─────────────────────────────────────
export interface MenuTriggerProps {
  trigger: ReactNode;
  position?: MenuPosition;
  children?: ReactNode;
}

export function MenuTrigger({ trigger, position = 'bottom-end', children }: MenuTriggerProps) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: position,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: 'menu' }),
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} style={{ display: 'inline-flex', cursor: 'pointer' }}>
        {trigger}
      </span>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} onClick={() => setOpen(false)}>
              <Menu>{children}</Menu>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
