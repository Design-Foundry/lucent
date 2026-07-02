import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives'; // ensures <lucent-icon> is registered for nested use
import type { ButtonVariant, ChipType, ControlSize, IconButtonSize, IconSize, ToggleSize } from './foundations';

const ICON_BTN_GLYPH: Record<IconButtonSize, IconSize> = { sm: 'sm', md: 'md', lg: 'lg' };

// ─── lucent-button (projects children into the inner button) ─────────────────────
@customElement('lucent-button')
export class LucentButton extends LucentSurface {
  @property() variant: ButtonVariant = 'primary';
  @property() size: ControlSize = 'md';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  private inner?: HTMLButtonElement;

  protected hostClasses(): string {
    return cx('lucent-button', `lucent-button--${this.variant}`, `lucent-button--${this.size}`, this.loading && 'is-loading');
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.inner) {
      const kids = Array.from(this.childNodes);
      this.inner = document.createElement('button');
      this.inner.className = 'lucent-button__inner';
      this.inner.append(...kids);
      this.appendChild(this.inner);
    }
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this.inner) {
      this.inner.type = this.type;
      this.inner.disabled = this.disabled || this.loading;
    }
  }
}

// ─── lucent-icon-button ─────────────────────────────────────────────────────────
@customElement('lucent-icon-button')
export class LucentIconButton extends LucentElement {
  @property() icon = '';
  @property() variant: ButtonVariant = 'primary';
  @property() size: IconButtonSize = 'md';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';
  @property() label = '';

  protected hostClasses(): string {
    return cx('lucent-icon-button', `lucent-icon-button--${this.variant}`, `lucent-icon-button--${this.size}`, this.loading && 'is-loading');
  }

  protected render(): TemplateResult {
    return html`
      <button class="lucent-icon-button__inner" type=${this.type} ?disabled=${this.disabled || this.loading} aria-label=${this.label || nothing}>
        ${this.loading
          ? html`<span class="lucent-spinner"></span>`
          : html`<lucent-icon name=${this.icon} size=${ICON_BTN_GLYPH[this.size]}></lucent-icon>`}
      </button>`;
  }
}

// ─── lucent-toggle ──────────────────────────────────────────────────────────────
@customElement('lucent-toggle')
export class LucentToggle extends LucentElement {
  @property() size: ToggleSize = 'md';
  @property() label = '';
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;

  protected hostClasses(): string {
    return cx('lucent-toggle', `lucent-toggle--${this.size}`, this.checked && 'is-checked', this.disabled && 'is-disabled');
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._toggle);
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._toggle);
    this.removeEventListener('keydown', this._onKey);
  }

  private _toggle = (): void => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true }));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this._toggle(); }
  };

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', String(this.checked));
    this.tabIndex = this.disabled ? -1 : 0;
    if (this.label) this.setAttribute('aria-label', this.label);
  }

  protected render(): TemplateResult {
    return html`
      <span class="lucent-toggle__track"><span class="lucent-toggle__thumb"></span></span>
      ${this.label ? html`<span class="lucent-toggle__label">${this.label}</span>` : nothing}`;
  }
}

// ─── lucent-chip ──────────────────────────────────────────────────────────────
@customElement('lucent-chip')
export class LucentChip extends LucentElement {
  @property() type: ChipType = 'default';
  @property() size: ControlSize = 'md';
  @property() label = '';

  protected hostClasses(): string {
    return cx('lucent-chip', `lucent-chip--${this.type}`, `lucent-chip--${this.size}`);
  }

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
  };

  protected render(): TemplateResult {
    return html`
      ${this.type === 'tag' ? html`<lucent-icon name="tag" size="sm"></lucent-icon>` : nothing}
      <span class="lucent-chip__label">${this.label}</span>
      ${this.type === 'action'
        ? html`<button type="button" class="lucent-chip__close" aria-label=${this.label ? `Remove ${this.label}` : 'Remove'} @click=${this._close}>
            <lucent-icon name="close" size="sm"></lucent-icon>
          </button>`
        : nothing}`;
  }
}

// ─── lucent-checkbox ─────────────────────────────────────────────────────────────
@customElement('lucent-checkbox')
export class LucentCheckbox extends LucentElement {
  @property() size: ControlSize = 'md';
  @property() label = '';
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: Boolean }) disabled = false;

  protected hostClasses(): string {
    return cx('lucent-checkbox', `lucent-checkbox--${this.size}`,
      this.checked && 'is-checked', this.indeterminate && 'is-indeterminate', this.disabled && 'is-disabled');
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._toggle);
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._toggle);
    this.removeEventListener('keydown', this._onKey);
  }

  private _toggle = (): void => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true }));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === ' ') { e.preventDefault(); this._toggle(); }
  };

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-checked', this.indeterminate ? 'mixed' : String(this.checked));
    this.tabIndex = this.disabled ? -1 : 0;
    if (this.label) this.setAttribute('aria-label', this.label);
  }

  protected render(): TemplateResult {
    return html`
      <span class="lucent-checkbox__box">
        ${this.checked && !this.indeterminate
          ? html`<lucent-icon class="lucent-checkbox__icon lucent-checkbox__icon--check" name="check" size="sm"></lucent-icon>`
          : nothing}
        ${this.indeterminate
          ? html`<lucent-icon class="lucent-checkbox__icon lucent-checkbox__icon--dash" name="remove" size="sm"></lucent-icon>`
          : nothing}
      </span>
      ${this.label ? html`<span class="lucent-checkbox__label">${this.label}</span>` : nothing}`;
  }
}

// ─── lucent-radio-group ──────────────────────────────────────────────────────────
@customElement('lucent-radio-group')
export class LucentRadioGroup extends LucentSurface {
  /** Currently selected radio value (string — web-component attributes are strings). */
  @property() value = '';
  @property() size: ControlSize = 'md';
  @property() label = '';
  @property({ type: Boolean }) disabled = false;

  protected hostClasses(): string {
    return 'lucent-radio-group';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'radiogroup');
    this.addEventListener('lucent-radio-select', this._onSelect as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('lucent-radio-select', this._onSelect as EventListener);
  }

  private _onSelect = (e: Event): void => {
    const detail = (e as CustomEvent<{ value: string }>).detail;
    this.value = detail.value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  };

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
    this.querySelectorAll<LucentRadio>('lucent-radio').forEach((r) => {
      r.checked = r.value === this.value;
      r.groupSize = this.size;
      r.groupDisabled = this.disabled;
      r.groupHasSelection = this.value !== '' && this.value != null;
    });
  }
}

// ─── lucent-radio ────────────────────────────────────────────────────────────────
@customElement('lucent-radio')
export class LucentRadio extends LucentElement {
  @property() value = '';
  @property() label = '';
  /** Per-radio density override; otherwise inherits the group's size. */
  @property() size?: ControlSize;
  @property({ type: Boolean }) disabled = false;

  /* Injected by the parent group (not reflected attributes). */
  @property({ type: Boolean, attribute: false }) checked = false;
  @property({ attribute: false }) groupSize?: ControlSize;
  @property({ type: Boolean, attribute: false }) groupDisabled = false;
  @property({ type: Boolean, attribute: false }) groupHasSelection = false;

  private get effSize(): ControlSize { return this.size ?? this.groupSize ?? 'md'; }
  private get isDisabled(): boolean { return this.disabled || this.groupDisabled; }

  protected hostClasses(): string {
    return cx('lucent-radio', `lucent-radio--${this.effSize}`, this.checked && 'is-checked', this.isDisabled && 'is-disabled');
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._select);
    this.addEventListener('keydown', this._onKey);
    const group = this.closest('lucent-radio-group') as LucentRadioGroup | null;
    if (group) {
      this.checked = group.value === this.value;
      this.groupSize = group.size;
      this.groupDisabled = group.disabled;
      this.groupHasSelection = group.value !== '' && group.value != null;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._select);
    this.removeEventListener('keydown', this._onKey);
  }

  private _select = (): void => {
    if (this.isDisabled) return;
    this.dispatchEvent(new CustomEvent('lucent-radio-select', { detail: { value: this.value }, bubbles: true }));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this._select(); }
  };

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'radio');
    this.setAttribute('aria-checked', String(this.checked));
    if (this.label) this.setAttribute('aria-label', this.label);
    this.tabIndex = this.isDisabled ? -1 : (this.checked || !this.groupHasSelection ? 0 : -1);
  }

  protected render(): TemplateResult {
    return html`<span class="lucent-radio__circle"></span>${this.label ? html`<span class="lucent-radio__label">${this.label}</span>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-button': LucentButton;
    'lucent-icon-button': LucentIconButton;
    'lucent-toggle': LucentToggle;
    'lucent-chip': LucentChip;
    'lucent-checkbox': LucentCheckbox;
    'lucent-radio-group': LucentRadioGroup;
    'lucent-radio': LucentRadio;
  }
}
