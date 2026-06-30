import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import { cx } from './cx';
import './primitives';
import type { BreadcrumbItem } from './foundations';

// ─── lucent-nav-icon ──────────────────────────────────────────────────────────
@customElement('lucent-nav-icon')
export class LucentNavIcon extends LucentElement {
  @property() name = 'widgets';
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) disabled = false;
  @property() label = '';

  protected hostClasses(): string {
    return cx('lucent-nav-icon', this.active && 'is-active', this.disabled && 'is-disabled');
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'button');
    this.tabIndex = this.disabled ? -1 : 0;
    if (this.disabled) this.setAttribute('aria-disabled', 'true'); else this.removeAttribute('aria-disabled');
    if (this.label) { this.setAttribute('aria-label', this.label); this.title = this.label; }
  }

  protected render(): TemplateResult {
    return html`<lucent-icon name=${this.name} size="lg"></lucent-icon>`;
  }
}

// ─── lucent-nav-rail (projects children) ─────────────────────────────────────────
@customElement('lucent-nav-rail')
export class LucentNavRail extends LucentSurface {
  protected hostClasses(): string { return 'lucent-nav-rail'; }
}

// ─── lucent-nav-divider ─────────────────────────────────────────────────────────
@customElement('lucent-nav-divider')
export class LucentNavDivider extends LucentElement {
  protected hostClasses(): string { return 'lucent-nav-divider'; }
  protected willUpdate(c: PropertyValues): void { super.willUpdate(c); this.setAttribute('role', 'separator'); }
  protected render() { return nothing; }
}

// ─── lucent-activity-bar (projects children) ─────────────────────────────────────
@customElement('lucent-activity-bar')
export class LucentActivityBar extends LucentSurface {
  protected hostClasses(): string { return 'lucent-activity-bar'; }
}

// ─── lucent-breadcrumbs ─────────────────────────────────────────────────────────
@customElement('lucent-breadcrumbs')
export class LucentBreadcrumbs extends LucentElement {
  /** Set via property (array) — e.g. `el.items = [...]`. */
  @property({ attribute: false }) items: BreadcrumbItem[] = [];

  protected hostClasses(): string { return 'lucent-breadcrumbs'; }

  private _click(item: BreadcrumbItem, last: boolean): void {
    if (!last) this.dispatchEvent(new CustomEvent('itemclick', { detail: item, bubbles: true }));
  }

  protected render(): TemplateResult {
    return html`${this.items.map((item, i) => {
      const last = i === this.items.length - 1;
      return html`
        <span class=${cx('lucent-breadcrumbs__item', last && 'is-last')} @click=${() => this._click(item, last)}>${item.label}</span>
        ${!last ? html`<span class="lucent-breadcrumbs__sep" aria-hidden="true">/</span>` : nothing}`;
    })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-nav-icon': LucentNavIcon;
    'lucent-nav-rail': LucentNavRail;
    'lucent-nav-divider': LucentNavDivider;
    'lucent-activity-bar': LucentActivityBar;
    'lucent-breadcrumbs': LucentBreadcrumbs;
  }
}
