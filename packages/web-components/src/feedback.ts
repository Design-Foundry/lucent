import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement } from './base';
import { cx } from './cx';
import './primitives';
import './controls';
import type { ModalVariant, SkeletonShape, SpinnerSize, ToastVariant } from './foundations';

// ─── lucent-spinner ───────────────────────────────────────────────────────────
@customElement('lucent-spinner')
export class LucentSpinner extends LucentElement {
  @property() size: SpinnerSize = 'md';
  /** Accessible name announced to assistive tech. Defaults to "Loading". */
  @property() label = 'Loading';

  protected hostClasses(): string {
    return `lucent-spinner lucent-spinner--${this.size}`;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'status');
    this.setAttribute('aria-label', this.label || 'Loading');
  }

  protected render(): TemplateResult {
    return html``;
  }
}

// ─── lucent-skeleton ──────────────────────────────────────────────────────────
@customElement('lucent-skeleton')
export class LucentSkeleton extends LucentElement {
  @property() shape: SkeletonShape = 'line';

  protected hostClasses(): string {
    return `lucent-skeleton lucent-skeleton--${this.shape}`;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('aria-hidden', 'true');
  }

  protected render(): TemplateResult {
    return html``;
  }
}

// ─── lucent-progress ──────────────────────────────────────────────────────────
@customElement('lucent-progress')
export class LucentProgress extends LucentElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) indeterminate = false;
  /** Accessible name for the bar (e.g. "Uploading"). */
  @property() label = '';

  protected hostClasses(): string {
    return cx('lucent-progress', this.indeterminate && 'lucent-progress--indeterminate');
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'progressbar');
    if (this.indeterminate) {
      this.removeAttribute('aria-valuemin');
      this.removeAttribute('aria-valuemax');
      this.removeAttribute('aria-valuenow');
    } else {
      this.setAttribute('aria-valuemin', '0');
      this.setAttribute('aria-valuemax', String(this.max));
      this.setAttribute('aria-valuenow', String(this.value));
    }
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
  }

  protected render(): TemplateResult {
    const pct = Math.max(0, Math.min(100, (this.value / (this.max || 100)) * 100));
    return html`<span class="lucent-progress__bar" style=${this.indeterminate ? '' : `width:${pct}%`}></span>`;
  }
}

// ─── lucent-snackbar ────────────────────────────────────────────────────────────
@customElement('lucent-snackbar')
export class LucentSnackbar extends LucentElement {
  @property() message = '';
  @property() icon = 'widgets';
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true;
  @property({ attribute: 'action-label' }) actionLabel = '';

  protected hostClasses(): string { return 'lucent-snackbar'; }

  private _action(): void { this.dispatchEvent(new CustomEvent('action', { bubbles: true })); }

  protected render(): TemplateResult {
    return html`
      <div class="lucent-snackbar__content">
        ${this.showIcon ? html`<lucent-icon name=${this.icon} size="md" class="lucent-snackbar__icon"></lucent-icon>` : nothing}
        <span class="lucent-snackbar__message">${this.message}</span>
      </div>
      ${this.actionLabel ? html`<lucent-button variant="ghost" @click=${this._action}>${this.actionLabel}</lucent-button>` : nothing}`;
  }
}

// ─── lucent-toast ───────────────────────────────────────────────────────────────
@customElement('lucent-toast')
export class LucentToast extends LucentElement {
  @property() title = '';
  @property() message = '';
  @property() variant: ToastVariant = 'informative';
  @property({ type: Boolean }) closable = true;

  protected hostClasses(): string {
    return cx('lucent-toast', `lucent-toast--${this.variant}`);
  }

  protected willUpdate(c: PropertyValues): void {
    super.willUpdate(c);
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
  }

  private _close(): void { this.dispatchEvent(new CustomEvent('close', { bubbles: true })); }

  protected render(): TemplateResult {
    return html`
      <div class="lucent-toast__header">
        <span class="lucent-toast__title">${this.title}</span>
        ${this.closable
          ? html`<lucent-icon-button class="lucent-toast__close" icon="close" variant="ghost" size="sm" label="Dismiss" @click=${this._close}></lucent-icon-button>`
          : nothing}
      </div>
      ${this.message ? html`<p class="lucent-toast__message">${this.message}</p>` : nothing}`;
  }
}

// ─── lucent-modal (centered overlay + scrim, no anchoring needed) ─────────────────
let modalSeq = 0;

@customElement('lucent-modal')
export class LucentModal extends LucentElement {
  @property({ type: Boolean }) open = false;
  @property() title = '';
  @property() subtitle = '';
  @property() variant: ModalVariant = 'informative';
  @property({ attribute: 'confirm-label' }) confirmLabel = 'Confirm';
  @property({ attribute: 'cancel-label' }) cancelLabel = 'Cancel';

  private readonly titleId = `lucent-modal-${modalSeq++}-title`;

  protected hostClasses(): string { return ''; } // host is a controller, not a visual element

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKey);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKey);
  }

  private _onKey = (e: KeyboardEvent): void => {
    if (this.open && e.key === 'Escape') { e.preventDefault(); this._close(); }
  };

  private get hasFooter(): boolean { return this.variant !== 'informative'; }
  private get isDestructive(): boolean { return this.variant === 'destructive'; }

  private _emit(name: string): void { this.dispatchEvent(new CustomEvent(name, { bubbles: true })); }
  private _close(): void { this._emit('close'); this.open = false; }
  private _cancel(): void { this._emit('cancel'); this.open = false; }
  private _confirm(): void { this._emit('confirm'); this.open = false; }

  protected render(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    return html`
      <div class="lucent-modal__scrim" style="display:grid;place-items:center" @click=${(e: Event) => { if (e.target === e.currentTarget) this._close(); }}>
        <div class="lucent-modal" role="dialog" aria-modal="true" aria-labelledby=${this.title ? this.titleId : nothing}>
          <div class="lucent-modal__header">
            <div class="lucent-modal__heading">
              <span class="lucent-modal__title" id=${this.titleId}>${this.title}</span>
              ${this.subtitle ? html`<p class="lucent-modal__subtitle">${this.subtitle}</p>` : nothing}
            </div>
            <lucent-icon-button icon="close" variant="ghost" size="sm" label="Close" @click=${this._close}></lucent-icon-button>
          </div>
          <div class="lucent-modal__body"></div>
          ${this.hasFooter
            ? html`<div class="lucent-modal__footer">
                <lucent-button variant="ghost" @click=${this._cancel}>${this.cancelLabel}</lucent-button>
                <lucent-button variant=${this.isDestructive ? 'danger' : 'primary'} @click=${this._confirm}>${this.confirmLabel}</lucent-button>
              </div>`
            : nothing}
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-spinner': LucentSpinner;
    'lucent-skeleton': LucentSkeleton;
    'lucent-progress': LucentProgress;
    'lucent-snackbar': LucentSnackbar;
    'lucent-toast': LucentToast;
    'lucent-modal': LucentModal;
  }
}
