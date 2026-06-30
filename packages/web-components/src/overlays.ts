import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives';
import type { ControlSize, MenuPosition, SelectOption, TooltipPosition } from './foundations';

// ─── lucent-tooltip (wraps a trigger; floats a bubble) ───────────────────────────
@customElement('lucent-tooltip')
export class LucentTooltip extends LucentSurface {
  @property() content = '';
  @property() position: TooltipPosition = 'top';

  private bubble?: HTMLElement;
  private cleanup?: () => void;

  protected hostClasses(): string { return ''; }

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'inline-flex';
    this.addEventListener('mouseenter', this._show);
    this.addEventListener('mouseleave', this._hide);
    this.addEventListener('focusin', this._show);
    this.addEventListener('focusout', this._hide);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hide();
    this.removeEventListener('mouseenter', this._show);
    this.removeEventListener('mouseleave', this._hide);
    this.removeEventListener('focusin', this._show);
    this.removeEventListener('focusout', this._hide);
  }

  private _show = (): void => {
    if (this.bubble || !this.content) return;
    const bubble = document.createElement('div');
    bubble.className = 'lucent-tooltip';
    bubble.setAttribute('role', 'tooltip');
    bubble.textContent = this.content;
    document.body.appendChild(bubble);
    this.bubble = bubble;
    this.cleanup = autoUpdate(this, bubble, () => {
      computePosition(this, bubble, { placement: this.position, middleware: [offset(6), flip(), shift({ padding: 8 })] })
        .then(({ x, y }) => Object.assign(bubble.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });
  };
  private _hide = (): void => {
    this.cleanup?.();
    this.cleanup = undefined;
    this.bubble?.remove();
    this.bubble = undefined;
  };
}

// ─── lucent-select ──────────────────────────────────────────────────────────────
let selectSeq = 0;

@customElement('lucent-select')
export class LucentSelect extends LucentElement {
  @property() value: unknown = null;
  @property({ attribute: false }) options: SelectOption[] = [];
  @property() size: ControlSize = 'md';
  @property() placeholder = 'Select an option';
  @property() label = '';
  @property() hint = '';
  @property() error = '';

  @state() private open = false;
  private dropdown?: HTMLElement;
  private cleanup?: () => void;
  private readonly ids = `lucent-select-${selectSeq++}`;

  protected hostClasses(): string { return cx('lucent-select', `lucent-select--${this.size}`); }

  private get hasError(): boolean { return !!this.error; }
  private get selectedLabel(): string { return this.options.find((o) => o.value === this.value)?.label ?? ''; }
  private get triggerModifier(): string {
    if (this.hasError) return 'lucent-select__trigger--error';
    if (this.open) return 'lucent-select__trigger--focus';
    if (this.value !== null && this.value !== undefined && this.value !== '') return 'lucent-select__trigger--filled';
    return '';
  }

  disconnectedCallback(): void { super.disconnectedCallback(); this._closeDropdown(); }

  private _toggle(): void { this.open ? this._closeDropdown() : this._openDropdown(); }

  private _openDropdown(): void {
    const trigger = this.querySelector<HTMLElement>('.lucent-select__trigger');
    if (!trigger) return;
    this.open = true;

    const dd = document.createElement('div');
    dd.className = 'lucent-select__dropdown';
    dd.setAttribute('role', 'listbox');
    this.options.forEach((opt) => {
      const row = document.createElement('lucent-option') as HTMLElement & { label: string; selected: boolean };
      row.label = opt.label;
      row.selected = opt.value === this.value;
      row.addEventListener('click', () => this._choose(opt.value));
      dd.appendChild(row);
    });
    document.body.appendChild(dd);
    this.dropdown = dd;

    this.cleanup = autoUpdate(trigger, dd, () => {
      computePosition(trigger, dd, {
        placement: 'bottom-start',
        middleware: [offset(4), flip({ padding: 8 }), size({ apply({ rects, elements }) { Object.assign(elements.floating.style, { width: `${rects.reference.width}px` }); }, padding: 8 })],
      }).then(({ x, y }) => Object.assign(dd.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });

    setTimeout(() => document.addEventListener('click', this._onOutside), 0);
  }

  private _closeDropdown(): void {
    this.open = false;
    this.cleanup?.();
    this.cleanup = undefined;
    this.dropdown?.remove();
    this.dropdown = undefined;
    document.removeEventListener('click', this._onOutside);
  }

  private _onOutside = (e: Event): void => {
    const t = e.target as Node;
    if (!this.contains(t) && !this.dropdown?.contains(t)) this._closeDropdown();
  };

  private _choose(value: unknown): void {
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true }));
    this._closeDropdown();
  }

  protected render(): TemplateResult {
    const msgId = `${this.ids}-msg`;
    return html`
      ${this.label ? html`<span class="lucent-select__label typography-caption" id=${`${this.ids}-label`}>${this.label}</span>` : nothing}
      <button type="button" class=${cx('lucent-select__trigger', this.triggerModifier)} role="combobox"
        aria-haspopup="listbox" aria-expanded=${this.open}
        aria-labelledby=${this.label ? `${this.ids}-label` : nothing}
        aria-invalid=${this.hasError ? 'true' : nothing}
        @click=${() => this._toggle()}>
        <span class=${cx('lucent-select__value', !this.selectedLabel && 'is-placeholder')}>${this.selectedLabel || this.placeholder}</span>
        <lucent-icon class=${cx('lucent-select__caret', this.open && 'is-open')} name="arrow_drop_down" size="md"></lucent-icon>
      </button>
      ${this.error || this.hint
        ? html`<span class=${cx('lucent-select__message', this.hasError && 'lucent-select__message--error')} id=${msgId}>${this.error || this.hint}</span>`
        : nothing}`;
  }
}

// ─── lucent-menu-trigger (wraps a trigger + a lucent-menu child) ─────────────────
@customElement('lucent-menu-trigger')
export class LucentMenuTrigger extends LucentSurface {
  @property() position: MenuPosition = 'bottom-end';

  @state() private open = false;
  private menu?: HTMLElement;
  private cleanup?: () => void;

  protected hostClasses(): string { return ''; }

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'inline-flex';
    // The lucent-menu child is the panel — detach it; show it positioned on trigger click.
    queueMicrotask(() => {
      this.menu = this.querySelector('lucent-menu') as HTMLElement | undefined;
      if (this.menu) this.menu.remove();
    });
    this.addEventListener('click', this._onTriggerClick);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._close();
    this.removeEventListener('click', this._onTriggerClick);
  }

  private _onTriggerClick = (e: Event): void => {
    if (this.menu?.contains(e.target as Node)) return;
    this.open ? this._close() : this._openMenu();
  };

  private _openMenu(): void {
    if (!this.menu) return;
    this.open = true;
    document.body.appendChild(this.menu);
    this.cleanup = autoUpdate(this, this.menu, () => {
      computePosition(this, this.menu!, {
        placement: this.position,
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => Object.assign(this.menu!.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });
    this.menu.addEventListener('click', this._close);
    setTimeout(() => document.addEventListener('click', this._onOutside), 0);
  }

  private _close = (): void => {
    this.open = false;
    this.cleanup?.();
    this.cleanup = undefined;
    if (this.menu && this.menu.parentElement === document.body) document.body.removeChild(this.menu);
    document.removeEventListener('click', this._onOutside);
  };

  private _onOutside = (e: Event): void => {
    const t = e.target as Node;
    if (!this.contains(t) && !this.menu?.contains(t)) this._close();
  };

  protected willUpdate(c: PropertyValues): void { super.willUpdate(c); }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-tooltip': LucentTooltip;
    'lucent-select': LucentSelect;
    'lucent-menu-trigger': LucentMenuTrigger;
  }
}
