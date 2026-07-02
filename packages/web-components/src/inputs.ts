import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LucentElement } from './base';
import { cx } from './cx';
import './primitives';
import type { AvatarScale, AvatarVariant, ControlSize } from './foundations';

// ─── lucent-avatar ──────────────────────────────────────────────────────────────
@customElement('lucent-avatar')
export class LucentAvatar extends LucentElement {
  @property() src = '';
  @property() name = '';
  @property() tenant = '';
  @property() scale: AvatarScale = 'md';
  @property() variant: AvatarVariant = 'trailing';

  protected hostClasses(): string {
    return cx('lucent-avatar', `lucent-avatar--${this.scale}`, `lucent-avatar--${this.variant}`);
  }

  private get initials(): string {
    return this.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
  private get showTenant(): boolean {
    return !!this.tenant && (this.scale === 'md' || this.scale === 'lg');
  }

  private labels(): TemplateResult {
    return html`<div class="lucent-avatar__labels">
      <span class="lucent-avatar__name">${this.name}</span>
      ${this.showTenant ? html`<span class="lucent-avatar__tenant">${this.tenant}</span>` : nothing}
    </div>`;
  }

  protected render(): TemplateResult {
    return html`
      ${this.variant === 'leading' ? this.labels() : nothing}
      <div class="lucent-avatar__circle">
        ${this.src
          ? html`<img src=${this.src} alt=${this.name} />`
          : html`<span class="lucent-avatar__initials">${this.initials}</span>`}
      </div>
      ${this.variant === 'trailing' ? this.labels() : nothing}`;
  }
}

// ─── lucent-inline-input ─────────────────────────────────────────────────────────
@customElement('lucent-inline-input')
export class LucentInlineInput extends LucentElement {
  @property() value = '';
  @property() placeholder = '';
  @property() typography = '';
  @property({ type: Boolean }) disabled = false;

  protected hostClasses(): string { return 'lucent-inline-input'; }

  private _onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true }));
  }

  protected render(): TemplateResult {
    return html`<input class=${cx('lucent-inline-input__field', this.typography)}
      .value=${this.value} placeholder=${this.placeholder} ?disabled=${this.disabled} @input=${this._onInput} />`;
  }
}

// ─── lucent-text-input ──────────────────────────────────────────────────────────
let textInputSeq = 0;

@customElement('lucent-text-input')
export class LucentTextInput extends LucentElement {
  @property() value = '';
  @property() size: ControlSize = 'md';
  @property() placeholder = '';
  @property() type = 'text';
  @property() label = '';
  @property() hint = '';
  @property() error = '';
  /** Leading icon name (the `.lucent-text-input__leading-icon` slot). */
  @property({ attribute: 'leading-icon' }) leadingIcon = '';
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) clearable = false;

  @state() private focused = false;
  private readonly fieldId = `lucent-text-input-${textInputSeq++}`;

  protected hostClasses(): string {
    return cx('lucent-text-input', `lucent-text-input--${this.size}`);
  }

  private get hasError(): boolean { return !!this.error; }

  private get wrapperModifier(): string {
    if (this.disabled) return 'lucent-text-input__wrapper--disabled';
    if (this.readonly) return 'lucent-text-input__wrapper--readonly';
    if (this.hasError) return 'lucent-text-input__wrapper--error';
    if (this.focused) return 'lucent-text-input__wrapper--focus';
    if (this.value) return 'lucent-text-input__wrapper--filled';
    return '';
  }

  private _onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true }));
  }

  private _clear(): void {
    this.value = '';
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('input', { detail: { value: '' }, bubbles: true }));
  }

  protected render(): TemplateResult {
    const msgId = `${this.fieldId}-msg`;
    return html`
      ${this.label ? html`<label class="lucent-text-input__label typography-caption" for=${this.fieldId}>${this.label}</label>` : nothing}
      <div class=${cx('lucent-text-input__wrapper', this.wrapperModifier)}>
        ${this.leadingIcon ? html`<lucent-icon class="lucent-text-input__leading-icon" name=${this.leadingIcon} size="sm"></lucent-icon>` : nothing}
        <input id=${this.fieldId} type=${this.type} placeholder=${this.placeholder} .value=${this.value}
          ?disabled=${this.disabled} ?readonly=${this.readonly}
          aria-invalid=${this.hasError ? 'true' : nothing}
          aria-describedby=${this.error || this.hint ? msgId : nothing}
          @input=${this._onInput} @focus=${() => (this.focused = true)} @blur=${() => (this.focused = false)} />
        ${this.clearable && this.value && !this.disabled && !this.readonly
          ? html`<button type="button" class="lucent-text-input__clear" aria-label="Clear" @click=${this._clear}>
              <lucent-icon name="close" size="sm"></lucent-icon>
            </button>`
          : nothing}
      </div>
      ${this.error || this.hint
        ? html`<span class=${cx('lucent-text-input__message', this.hasError && 'lucent-text-input__message--error')} id=${msgId}>${this.error || this.hint}</span>`
        : nothing}`;
  }
}

// ─── lucent-textarea ──────────────────────────────────────────────────────────
let textareaSeq = 0;

@customElement('lucent-textarea')
export class LucentTextarea extends LucentElement {
  @property() value = '';
  @property() size: ControlSize = 'md';
  @property() placeholder = '';
  @property() label = '';
  @property() hint = '';
  @property() error = '';
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) disabled = false;

  @state() private focused = false;
  private readonly fieldId = `lucent-textarea-${textareaSeq++}`;

  protected hostClasses(): string {
    return cx('lucent-textarea', `lucent-textarea--${this.size}`);
  }

  private get hasError(): boolean { return !!this.error; }

  private get wrapperModifier(): string {
    if (this.disabled) return 'lucent-textarea__wrapper--disabled';
    if (this.readonly) return 'lucent-textarea__wrapper--readonly';
    if (this.hasError) return 'lucent-textarea__wrapper--error';
    if (this.focused) return 'lucent-textarea__wrapper--focus';
    if (this.value) return 'lucent-textarea__wrapper--filled';
    return '';
  }

  private _onInput(e: Event): void {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true }));
  }

  protected render(): TemplateResult {
    const msgId = `${this.fieldId}-msg`;
    return html`
      ${this.label ? html`<label class="lucent-textarea__label typography-caption" for=${this.fieldId}>${this.label}</label>` : nothing}
      <div class=${cx('lucent-textarea__wrapper', this.wrapperModifier)}>
        <textarea id=${this.fieldId} rows=${this.rows} placeholder=${this.placeholder} .value=${this.value}
          ?disabled=${this.disabled} ?readonly=${this.readonly}
          aria-invalid=${this.hasError ? 'true' : nothing}
          aria-describedby=${this.error || this.hint ? msgId : nothing}
          @input=${this._onInput} @focus=${() => (this.focused = true)} @blur=${() => (this.focused = false)}></textarea>
      </div>
      ${this.error || this.hint
        ? html`<span class=${cx('lucent-textarea__message', this.hasError && 'lucent-textarea__message--error')} id=${msgId}>${this.error || this.hint}</span>`
        : nothing}`;
  }
}

// ─── lucent-option ──────────────────────────────────────────────────────────────
@customElement('lucent-option')
export class LucentOption extends LucentElement {
  @property() label = '';
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) disabled = false;

  protected hostClasses(): string {
    return cx('lucent-option', this.selected && 'is-selected', this.active && 'is-active', this.disabled && 'is-disabled');
  }

  protected render(): TemplateResult {
    return html`<span class="lucent-option__label">${this.label}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-avatar': LucentAvatar;
    'lucent-inline-input': LucentInlineInput;
    'lucent-text-input': LucentTextInput;
    'lucent-textarea': LucentTextarea;
    'lucent-option': LucentOption;
  }
}
