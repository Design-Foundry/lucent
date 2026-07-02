import { type ReactNode, useState } from 'react';
import { cx } from './cx';
import { Badge, Icon } from './primitives';
import { IconButton } from './controls';
import type { ControlSize, MessageGroup, MessageRole, PromptSuggestionVariant, ReferenceKind, TypingVariant } from './foundations';

const COMPOSER_BTN_SIZE: Record<ControlSize, 'sm' | 'md' | 'lg'> = { xs: 'sm', sm: 'sm', md: 'md', lg: 'lg' };

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

// ─── Code block ─────────────────────────────────────────────────────────────────
export interface CodeBlockProps {
  language?: string;
  code?: string;
  className?: string;
}

/** A fenced code block with a language label and a copy button. */
export function CodeBlock({ language = '', code = '', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={cx('lucent-code-block', className)}>
      <div className="lucent-code-block__header">
        <span className="lucent-code-block__lang">{language}</span>
        <IconButton
          className="lucent-code-block__copy"
          icon={copied ? 'check' : 'content_copy'}
          variant="ghost"
          size="sm"
          ariaLabel={copied ? 'Copied' : 'Copy code'}
          onClick={copy}
        />
      </div>
      <pre className="lucent-code-block__body"><code>{code}</code></pre>
    </div>
  );
}

// ─── Prompt suggestion ──────────────────────────────────────────────────────────
export interface PromptSuggestionProps {
  variant?: PromptSuggestionVariant;
  label?: string;
  /** Second line (card variant only). */
  description?: string;
  icon?: string;
  onSelect?: (label: string) => void;
  children?: ReactNode;
  className?: string;
}

/** A clickable starter for an empty chat. Emits its prompt on click. */
export function PromptSuggestion({ variant = 'card', label = '', description, icon, onSelect, children, className }: PromptSuggestionProps) {
  return (
    <button
      type="button"
      className={cx('lucent-prompt-suggestion', `lucent-prompt-suggestion--${variant}`, className)}
      onClick={() => onSelect?.(label)}
    >
      {icon && <Icon className="lucent-prompt-suggestion__icon" name={icon} size="sm" />}
      <span className="lucent-prompt-suggestion__content">
        <span className="lucent-prompt-suggestion__title">{children ?? label}</span>
        {description && variant === 'card' && <span className="lucent-prompt-suggestion__desc">{description}</span>}
      </span>
    </button>
  );
}

// ─── Composer ───────────────────────────────────────────────────────────────────
export interface ComposerProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  onStop?: () => void;
  placeholder?: string;
  size?: ControlSize;
  disabled?: boolean;
  /** Submitting — send shows a spinner. */
  sending?: boolean;
  /** The agent is streaming — send morphs to Stop. */
  streaming?: boolean;
  className?: string;
}

/** The message input for chat & messaging. Send morphs: send → loading → stop while streaming. */
export function Composer({
  value = '', onChange, onSend, onStop, placeholder = 'Message…', size = 'md',
  disabled = false, sending = false, streaming = false, className,
}: ComposerProps) {
  const canSend = !disabled && !sending && !streaming && value.trim().length > 0;
  const doSend = () => { if (canSend) onSend?.(value.trim()); };
  return (
    <div className={cx('lucent-composer', `lucent-composer--${size}`, disabled && 'lucent-composer--disabled', className)}>
      <textarea
        className="lucent-composer__field"
        rows={1}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } }}
      />
      <div className="lucent-composer__actions">
        {streaming ? (
          <IconButton icon="stop" variant="primary" size={COMPOSER_BTN_SIZE[size]} ariaLabel="Stop generating" onClick={() => onStop?.()} />
        ) : (
          <IconButton icon="arrow_upward" variant="primary" size={COMPOSER_BTN_SIZE[size]} loading={sending} disabled={!canSend} ariaLabel="Send" onClick={doSend} />
        )}
      </div>
    </div>
  );
}

// ─── Chat trigger (FAB) ─────────────────────────────────────────────────────────
export interface ChatTriggerProps {
  icon?: string;
  unread?: number;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

/** The floating action button that opens the chat — accent circle + optional unread badge. */
export function ChatTrigger({ icon = 'forum', unread = 0, ariaLabel = 'Open chat', onClick, className }: ChatTriggerProps) {
  const unreadLabel = unread > 99 ? '99+' : String(unread);
  const fullLabel = unread > 0 ? `${ariaLabel}, ${unread} unread` : ariaLabel;
  return (
    <button type="button" className={cx('lucent-chat-trigger', className)} aria-label={fullLabel} onClick={onClick}>
      <Icon name={icon} size="md" />
      {unread > 0 && <Badge className="lucent-chat-trigger__badge" kind="count" variant="error" label={unreadLabel} />}
    </button>
  );
}

// ─── Conversation row ───────────────────────────────────────────────────────────
export interface ConversationRowProps {
  title?: string;
  preview?: string;
  time?: string;
  unread?: number;
  active?: boolean;
  /** Leading avatar/icon. */
  avatar?: ReactNode;
  onSelect?: () => void;
  className?: string;
}

/** A row in a conversation/inbox list — avatar + title + preview + time + unread. */
export function ConversationRow({ title = '', preview = '', time = '', unread = 0, active = false, avatar, onSelect, className }: ConversationRowProps) {
  const unreadLabel = unread > 99 ? '99+' : String(unread);
  const fullLabel = unread > 0 ? `${title}, ${unread} unread` : title;
  return (
    <button
      type="button"
      className={cx('lucent-conversation-row', active && 'is-active', className)}
      aria-current={active ? 'true' : undefined}
      aria-label={fullLabel}
      onClick={onSelect}
    >
      {avatar && <span className="lucent-conversation-row__leading">{avatar}</span>}
      <span className="lucent-conversation-row__main">
        <span className="lucent-conversation-row__title">{title}</span>
        <span className="lucent-conversation-row__preview">{preview}</span>
      </span>
      <span className="lucent-conversation-row__meta">
        {time && <span className="lucent-conversation-row__time">{time}</span>}
        {unread > 0 && <Badge className="lucent-conversation-row__badge" kind="count" variant="accent" label={unreadLabel} />}
      </span>
    </button>
  );
}
