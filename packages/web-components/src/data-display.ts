import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives';
import type { Tone } from './foundations';

// ─── lucent-list (projects children) ─────────────────────────────────────────────
@customElement('lucent-list')
export class LucentList extends LucentSurface {
  protected hostClasses(): string { return 'lucent-list'; }
}

// ─── lucent-list-item ───────────────────────────────────────────────────────────
@customElement('lucent-list-item')
export class LucentListItem extends LucentElement {
  @property() label = '';
  @property() icon = '';
  /** Secondary line. */
  @property() supporting = '';
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) interactive = true;
  @property() tone: Tone = 'default';

  protected hostClasses(): string {
    return cx('lucent-list-item',
      this.selected && 'is-selected', this.disabled && 'is-disabled',
      this.interactive && 'is-interactive', this.tone === 'danger' && 'is-danger');
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

  private _activate = (): void => {
    if (this.interactive && !this.disabled) this.dispatchEvent(new CustomEvent('activate', { bubbles: true }));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (!this.interactive || this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._activate(); }
  };

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this.interactive) { this.setAttribute('role', 'button'); this.tabIndex = this.disabled ? -1 : 0; }
    else { this.removeAttribute('role'); this.removeAttribute('tabindex'); }
    if (this.disabled) this.setAttribute('aria-disabled', 'true'); else this.removeAttribute('aria-disabled');
  }

  protected render(): TemplateResult {
    return html`
      ${this.icon
        // The leading glyph scales with the row: a two-line row (label + supporting) is tall
        // enough that a 14px icon reads as a speck beside it, so it steps up to lg. A single
        // line row stays compact. The icon matches the content block, not a fixed size.
        ? html`<lucent-icon class="lucent-list-item__icon" name=${this.icon} size=${this.supporting ? 'lg' : 'md'}></lucent-icon>`
        : nothing}
      <span class="lucent-list-item__content">
        <span class="lucent-list-item__primary">${this.label}</span>
        ${this.supporting ? html`<span class="lucent-list-item__supporting">${this.supporting}</span>` : nothing}
      </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-list': LucentList;
    'lucent-list-item': LucentListItem;
  }
}
