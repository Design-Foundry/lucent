import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives'; // ensures <lucent-icon> is registered for nested use
import './controls'; // ensures <lucent-icon-button> is registered for nested use
import type { ControlSize, MessageGroup, MessageRole, PromptSuggestionVariant, ReferenceKind, TypingVariant } from './foundations';

const COMPOSER_BTN_SIZE: Record<ControlSize, 'sm' | 'md' | 'lg'> = { xs: 'sm', sm: 'sm', md: 'md', lg: 'lg' };

const REF_ICON: Record<ReferenceKind, string> = {
  mention: 'alternate_email', component: 'widgets', resource: 'link', token: 'palette',
};

// ─── lucent-reference-tag ──────────────────────────────────────────────────────
@customElement('lucent-reference-tag')
export class LucentReferenceTag extends LucentElement {
  @property() kind: ReferenceKind = 'mention';
  @property() label = '';
  /** Override the default per-kind glyph. */
  @property() icon = '';
  /** For `token`: a CSS colour shown as a swatch. */
  @property() swatch = '';

  protected hostClasses(): string {
    return cx('lucent-reference-tag', `lucent-reference-tag--${this.kind}`);
  }

  protected render(): TemplateResult {
    const showSwatch = this.kind === 'token' && !!this.swatch;
    return html`${showSwatch
      ? html`<span class="lucent-reference-tag__swatch" style=${`background:${this.swatch}`}></span>`
      : html`<lucent-icon class="lucent-reference-tag__icon" name=${this.icon || REF_ICON[this.kind]} size="xs"></lucent-icon>`}<span class="lucent-reference-tag__label">${this.label}</span>`;
  }
}

// ─── lucent-message-bubble ─────────────────────────────────────────────────────
/**
 * Chat/message bubble. Extends LucentSurface so the authored body (rich light-DOM children)
 * is preserved; the meta line (author + time) is built imperatively. NOTE: the sender role is
 * the `sender` attribute (not `role`) to avoid clashing with the ARIA `role` attribute.
 */
@customElement('lucent-message-bubble')
export class LucentMessageBubble extends LucentSurface {
  /** Sender role — `sender` (not `role`) to avoid the ARIA `role` attribute. */
  @property() sender: MessageRole = 'assistant';
  @property() group: MessageGroup = 'standalone';
  @property() author = '';
  @property() timestamp = '';

  private _built = false;
  private _meta?: HTMLElement;
  private _authorEl?: HTMLElement;
  private _timeEl?: HTMLElement;

  protected hostClasses(): string {
    return cx('lucent-message-bubble', `lucent-message-bubble--${this.sender}`, `lucent-message-bubble--${this.group}`);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._built) this._build();
    this._sync();
  }

  private _build(): void {
    const body = document.createElement('div');
    body.className = 'lucent-message-bubble__body';
    while (this.firstChild) body.appendChild(this.firstChild);

    const meta = document.createElement('div');
    meta.className = 'lucent-message-bubble__meta';
    const author = document.createElement('span');
    author.className = 'lucent-message-bubble__author';
    const time = document.createElement('span');
    time.className = 'lucent-message-bubble__time';
    meta.appendChild(author);
    meta.appendChild(time);

    this.appendChild(meta);
    this.appendChild(body);

    this._meta = meta;
    this._authorEl = author;
    this._timeEl = time;
    this._built = true;
  }

  private _sync(): void {
    if (this._authorEl) { this._authorEl.textContent = this.author; this._authorEl.hidden = !this.author; }
    if (this._timeEl) { this._timeEl.textContent = this.timestamp; this._timeEl.hidden = !this.timestamp; }
    if (this._meta) this._meta.hidden = !this.author && !this.timestamp;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._sync();
  }

  protected render(): TemplateResult {
    return html``; // body is preserved light DOM; meta built imperatively
  }
}

// ─── lucent-typing-indicator ───────────────────────────────────────────────────
@customElement('lucent-typing-indicator')
export class LucentTypingIndicator extends LucentElement {
  @property() variant: TypingVariant = 'typing';
  /** Optional label (defaults to "Generating…" for the generating variant). */
  @property() label = '';

  private get labelText(): string {
    return this.label || (this.variant === 'generating' ? 'Generating…' : '');
  }

  protected hostClasses(): string {
    return cx('lucent-typing-indicator', `lucent-typing-indicator--${this.variant}`);
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('aria-label', this.label || (this.variant === 'generating' ? 'Generating' : 'Typing'));
  }

  protected render(): TemplateResult {
    return html`<span class="lucent-typing-indicator__dots" aria-hidden="true"><span class="lucent-typing-indicator__dot"></span><span class="lucent-typing-indicator__dot"></span><span class="lucent-typing-indicator__dot"></span></span>${this.labelText ? html`<span class="lucent-typing-indicator__label">${this.labelText}</span>` : nothing}`;
  }
}

// ─── lucent-code-block ─────────────────────────────────────────────────────────
@customElement('lucent-code-block')
export class LucentCodeBlock extends LucentElement {
  @property() language = '';
  @property() code = '';
  @state() private copied = false;

  protected hostClasses(): string {
    return 'lucent-code-block';
  }

  private _copy = (): void => {
    void navigator.clipboard?.writeText(this.code);
    this.copied = true;
    setTimeout(() => { this.copied = false; }, 1500);
  };

  protected render(): TemplateResult {
    return html`
      <div class="lucent-code-block__header">
        <span class="lucent-code-block__lang">${this.language}</span>
        <lucent-icon-button
          class="lucent-code-block__copy"
          icon=${this.copied ? 'check' : 'content_copy'}
          variant="ghost"
          size="sm"
          label=${this.copied ? 'Copied' : 'Copy code'}
          @click=${this._copy}></lucent-icon-button>
      </div>
      <pre class="lucent-code-block__body"><code>${this.code}</code></pre>`;
  }
}

// ─── lucent-prompt-suggestion ──────────────────────────────────────────────────
@customElement('lucent-prompt-suggestion')
export class LucentPromptSuggestion extends LucentElement {
  @property() variant: PromptSuggestionVariant = 'card';
  @property() label = '';
  /** Second line (card variant only). */
  @property() description = '';
  @property() icon = '';

  protected hostClasses(): string {
    return cx('lucent-prompt-suggestion', `lucent-prompt-suggestion--${this.variant}`);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._activate);
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._activate);
    this.removeEventListener('keydown', this._onKey);
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'button');
    this.tabIndex = 0;
  }

  private _activate = (): void => {
    this.dispatchEvent(new CustomEvent('select', { detail: { label: this.label }, bubbles: true }));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._activate(); }
  };

  protected render(): TemplateResult {
    return html`${this.icon ? html`<lucent-icon class="lucent-prompt-suggestion__icon" name=${this.icon} size="sm"></lucent-icon>` : nothing}<span class="lucent-prompt-suggestion__content"><span class="lucent-prompt-suggestion__title">${this.label}</span>${this.description && this.variant === 'card' ? html`<span class="lucent-prompt-suggestion__desc">${this.description}</span>` : nothing}</span>`;
  }
}

// ─── lucent-composer ───────────────────────────────────────────────────────────
@customElement('lucent-composer')
export class LucentComposer extends LucentElement {
  @property() value = '';
  @property() placeholder = 'Message…';
  @property() size: ControlSize = 'md';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) sending = false;
  @property({ type: Boolean }) streaming = false;

  private get canSend(): boolean {
    return !this.disabled && !this.sending && !this.streaming && this.value.trim().length > 0;
  }

  protected hostClasses(): string {
    return cx('lucent-composer', `lucent-composer--${this.size}`, this.disabled && 'lucent-composer--disabled');
  }

  private _onInput = (e: Event): void => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true }));
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._send(); }
  };

  private _send = (): void => {
    if (!this.canSend) return;
    const text = this.value.trim();
    this.value = '';
    this.dispatchEvent(new CustomEvent('send', { detail: { value: text }, bubbles: true }));
  };

  private _stop = (): void => {
    this.dispatchEvent(new CustomEvent('stop', { bubbles: true }));
  };

  protected render(): TemplateResult {
    const btn = COMPOSER_BTN_SIZE[this.size];
    return html`
      <textarea class="lucent-composer__field" rows="1" placeholder=${this.placeholder} .value=${this.value}
        ?disabled=${this.disabled} @input=${this._onInput} @keydown=${this._onKeyDown}></textarea>
      <div class="lucent-composer__actions">
        ${this.streaming
          ? html`<lucent-icon-button icon="stop" variant="primary" size=${btn} label="Stop generating" @click=${this._stop}></lucent-icon-button>`
          : html`<lucent-icon-button icon="arrow_upward" variant="primary" size=${btn} ?loading=${this.sending} ?disabled=${!this.canSend} label="Send" @click=${this._send}></lucent-icon-button>`}
      </div>`;
  }
}

// ─── lucent-chat-trigger (FAB) ─────────────────────────────────────────────────
@customElement('lucent-chat-trigger')
export class LucentChatTrigger extends LucentElement {
  @property() icon = 'forum';
  @property({ type: Number }) unread = 0;
  @property() label = 'Open chat';

  private get unreadLabel(): string { return this.unread > 99 ? '99+' : String(this.unread); }

  protected hostClasses(): string {
    return 'lucent-chat-trigger';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKey);
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'button');
    this.tabIndex = 0;
    this.setAttribute('aria-label', this.unread > 0 ? `${this.label}, ${this.unread} unread` : this.label);
  }

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
  };

  protected render(): TemplateResult {
    return html`<lucent-icon name=${this.icon} size="md"></lucent-icon>${this.unread > 0
      ? html`<lucent-badge class="lucent-chat-trigger__badge" kind="count" variant="error" label=${this.unreadLabel}></lucent-badge>`
      : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-reference-tag': LucentReferenceTag;
    'lucent-message-bubble': LucentMessageBubble;
    'lucent-typing-indicator': LucentTypingIndicator;
    'lucent-code-block': LucentCodeBlock;
    'lucent-prompt-suggestion': LucentPromptSuggestion;
    'lucent-composer': LucentComposer;
    'lucent-chat-trigger': LucentChatTrigger;
  }
}
