import { type ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './primitives';
import type { MessageGroup, MessageRole, ReferenceKind, TypingVariant } from './foundations';

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

// ─── Message bubble ─────────────────────────────────────────────────────────────
export interface MessageBubbleProps {
  role?: MessageRole;
  group?: MessageGroup;
  author?: string;
  timestamp?: string;
  children?: ReactNode;
  className?: string;
}

/** A chat/message bubble for AI chat and human messaging. Body holds rich content. */
export function MessageBubble({ role = 'assistant', group = 'standalone', author, timestamp, children, className }: MessageBubbleProps) {
  return (
    <div className={cx('lucent-message-bubble', `lucent-message-bubble--${role}`, `lucent-message-bubble--${group}`, className)}>
      {(author || timestamp) && (
        <div className="lucent-message-bubble__meta">
          {author && <span className="lucent-message-bubble__author">{author}</span>}
          {timestamp && <span className="lucent-message-bubble__time">{timestamp}</span>}
        </div>
      )}
      <div className="lucent-message-bubble__body">{children}</div>
    </div>
  );
}

// ─── Typing indicator ───────────────────────────────────────────────────────────
export interface TypingIndicatorProps {
  variant?: TypingVariant;
  /** Optional label (defaults to "Generating…" for the generating variant). */
  label?: string;
  className?: string;
}

/** Live dots shown where the next message will appear — typing (person) or generating (agent). */
export function TypingIndicator({ variant = 'typing', label = '', className }: TypingIndicatorProps) {
  const labelText = label || (variant === 'generating' ? 'Generating…' : '');
  const ariaLabel = label || (variant === 'generating' ? 'Generating' : 'Typing');
  return (
    <div
      className={cx('lucent-typing-indicator', `lucent-typing-indicator--${variant}`, className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <span className="lucent-typing-indicator__dots" aria-hidden>
        <span className="lucent-typing-indicator__dot" />
        <span className="lucent-typing-indicator__dot" />
        <span className="lucent-typing-indicator__dot" />
      </span>
      {labelText && <span className="lucent-typing-indicator__label">{labelText}</span>}
    </div>
  );
}
