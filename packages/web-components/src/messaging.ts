import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives'; // ensures <lucent-icon> is registered for nested use
import type { MessageGroup, MessageRole, ReferenceKind, TypingVariant } from './foundations';

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

declare global {
  interface HTMLElementTagNameMap {
    'lucent-reference-tag': LucentReferenceTag;
    'lucent-message-bubble': LucentMessageBubble;
    'lucent-typing-indicator': LucentTypingIndicator;
  }
}
