import { type ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { ReferenceKind } from './foundations';

const REF_ICON: Record<ReferenceKind, string> = {
  mention: 'alternate_email', component: 'widgets', resource: 'link', token: 'palette',
};

// ─── Reference tag ──────────────────────────────────────────────────────────────
export interface ReferenceTagProps {
  kind?: ReferenceKind;
  label?: string;
  /** Override the default per-kind glyph. */
  icon?: string;
  /** For `token`: a CSS colour shown as a swatch. */
  swatch?: string;
  children?: ReactNode;
  className?: string;
}

/** A small inline chip referencing an entity — @mention, component, token (with swatch), or resource. */
export function ReferenceTag({ kind = 'mention', label = '', icon, swatch, children, className }: ReferenceTagProps) {
  const showSwatch = kind === 'token' && !!swatch;
  return (
    <span className={cx('lucent-reference-tag', `lucent-reference-tag--${kind}`, className)}>
      {showSwatch
        ? <span className="lucent-reference-tag__swatch" style={{ background: swatch }} />
        : <Icon className="lucent-reference-tag__icon" name={icon || REF_ICON[kind]} size="xs" />}
      <span className="lucent-reference-tag__label">{children ?? label}</span>
    </span>
  );
}
