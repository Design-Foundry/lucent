import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives';
import type { MenuItemVariant, TabScale } from './foundations';

// ─── lucent-card (projects children) ─────────────────────────────────────────────
@customElement('lucent-card')
export class LucentCard extends LucentSurface {
  protected hostClasses(): string { return 'lucent-card'; }
}

// ─── lucent-tab ─────────────────────────────────────────────────────────────────
@customElement('lucent-tab')
export class LucentTab extends LucentElement {
  @property() value = '';
  @property() label = '';
  @property() icon = '';
  @property({ type: Boolean }) disabled = false;
  /** Driven by the parent lucent-tab-list. */
  @property() scale: TabScale = 'md';
  @property({ type: Boolean }) active = false;

  protected hostClasses(): string {
    return cx('lucent-tab', `lucent-tab--${this.scale}`, this.active && 'lucent-tab--active', this.disabled && 'lucent-tab--disabled');
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', String(this.active));
    this.tabIndex = this.active ? 0 : -1;
  }

  protected render(): TemplateResult {
    return html`
      ${this.icon ? html`<lucent-icon name=${this.icon} size=${this.scale === 'lg' ? 'lg' : 'md'}></lucent-icon>` : nothing}
      <span class="lucent-tab__label">${this.label}</span>`;
  }
}

// ─── lucent-tab-list (coordinates its lucent-tab children) ───────────────────────
@customElement('lucent-tab-list')
export class LucentTabList extends LucentSurface {
  @property() scale: TabScale = 'md';
  @property({ attribute: 'active-tab' }) activeTab = '';

  protected hostClasses(): string { return 'lucent-tab-list'; }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tablist');
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._onClick);
  }

  private _onClick = (e: Event): void => {
    const tab = (e.target as HTMLElement).closest('lucent-tab') as LucentTab | null;
    if (tab && !tab.disabled) {
      this.activeTab = tab.value;
      this.dispatchEvent(new CustomEvent('tabchange', { detail: tab.value, bubbles: true }));
      this._sync();
    }
  };

  private _sync(): void {
    this.querySelectorAll<LucentTab>('lucent-tab').forEach((tab) => {
      tab.scale = this.scale;
      tab.active = tab.value === this.activeTab;
    });
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._sync();
  }

  protected firstUpdated(changed: PropertyValues): void {
    super.firstUpdated?.(changed);
    this._sync();
  }
}

// ─── lucent-menu (projects children) ─────────────────────────────────────────────
@customElement('lucent-menu')
export class LucentMenu extends LucentSurface {
  protected hostClasses(): string { return 'lucent-menu'; }
  protected willUpdate(c: PropertyValues): void { super.willUpdate(c); this.setAttribute('role', 'menu'); }
}

// ─── lucent-menu-item ───────────────────────────────────────────────────────────
@customElement('lucent-menu-item')
export class LucentMenuItem extends LucentElement {
  @property() label = '';
  @property() icon = '';
  @property({ type: Boolean }) active = false;
  @property() variant: MenuItemVariant = 'default';

  protected hostClasses(): string {
    return cx('lucent-menu-item', this.active && 'is-active', this.variant === 'danger' && 'is-danger');
  }

  protected willUpdate(c: PropertyValues): void {
    super.willUpdate(c);
    this.setAttribute('role', 'menuitem');
    this.tabIndex = 0;
  }

  protected render(): TemplateResult {
    return html`
      ${this.icon ? html`<lucent-icon name=${this.icon} size="sm" class="lucent-menu-item__icon"></lucent-icon>` : nothing}
      <span class="lucent-menu-item__label">${this.label}</span>`;
  }
}

// ─── lucent-menu-divider ─────────────────────────────────────────────────────────
/** @deprecated Use `<lucent-divider>` (the unified Divider, `variant="plain"`) instead. */
@customElement('lucent-menu-divider')
export class LucentMenuDivider extends LucentElement {
  protected hostClasses(): string { return 'lucent-menu-divider'; }
  protected willUpdate(c: PropertyValues): void { super.willUpdate(c); this.setAttribute('role', 'separator'); }
  protected render() { return nothing; }
}

// ─── lucent-accordion ────────────────────────────────────────────────────────────
let accordionSeq = 0;

/**
 * A single disclosure. Extends LucentSurface so the authored light-DOM children survive
 * (Lit renders into a detached sink); the header is built imperatively and the children are
 * moved into a content region we toggle. Rich, live content is preserved (no re-parse).
 */
@customElement('lucent-accordion')
export class LucentAccordion extends LucentSurface {
  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) disabled = false;

  private _built = false;
  private _header?: HTMLButtonElement;
  private _content?: HTMLDivElement;
  private readonly _id = accordionSeq++;

  protected hostClasses(): string {
    return cx('lucent-accordion', this.open && 'is-expanded', this.disabled && 'is-disabled');
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._built) this._build();
    this._sync();
  }

  private _build(): void {
    const headerId = `lucent-accordion-h-${this._id}`;
    const contentId = `lucent-accordion-c-${this._id}`;

    const content = document.createElement('div');
    content.className = 'lucent-accordion__content';
    content.id = contentId;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', headerId);
    while (this.firstChild) content.appendChild(this.firstChild);

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'lucent-accordion__header';
    header.id = headerId;
    header.setAttribute('aria-controls', contentId);
    header.innerHTML =
      '<span class="lucent-accordion__title"></span>' +
      '<lucent-icon class="lucent-accordion__chevron" name="expand_more" size="sm"></lucent-icon>';
    header.addEventListener('click', () => this._toggle());

    this.appendChild(header);
    this.appendChild(content);
    this._header = header;
    this._content = content;
    this._built = true;
  }

  private _toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true }));
  }

  private _sync(): void {
    if (!this._header || !this._content) return;
    const title = this._header.querySelector('.lucent-accordion__title');
    if (title) title.textContent = this.heading;
    this._header.setAttribute('aria-expanded', this.open ? 'true' : 'false');
    this._header.disabled = this.disabled;
    this._content.hidden = !this.open;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._sync();
  }

  protected render(): TemplateResult {
    return html``; // real DOM is built imperatively into the host (light DOM)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-card': LucentCard;
    'lucent-tab': LucentTab;
    'lucent-tab-list': LucentTabList;
    'lucent-menu': LucentMenu;
    'lucent-menu-item': LucentMenuItem;
    'lucent-menu-divider': LucentMenuDivider;
    'lucent-accordion': LucentAccordion;
  }
}
