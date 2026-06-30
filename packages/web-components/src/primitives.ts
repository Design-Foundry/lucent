import { html, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import type { IconSize, StatusTagVariant } from './foundations';

// ─── lucent-icon ──────────────────────────────────────────────────────────────
@customElement('lucent-icon')
export class LucentIcon extends LucentElement {
  /** Material Icons ligature name (e.g. `settings`, `more_vert`). */
  @property() name = 'widgets';
  @property() size: IconSize = 'md';
  /** Accessible name — set only when the icon conveys meaning on its own. */
  @property() label = '';

  protected hostClasses(): string {
    return `lucent-icon lucent-icon--${this.size}`;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const meaningful = !!this.label;
    if (meaningful) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
  }

  protected render(): TemplateResult {
    return html`<span class="material-icons lucent-icon__glyph">${this.name}</span>`;
  }
}

// ─── lucent-tag (projects children) ─────────────────────────────────────────────
@customElement('lucent-tag')
export class LucentTag extends LucentSurface {
  protected hostClasses(): string {
    return 'lucent-tag';
  }
}

// ─── lucent-status-tag ──────────────────────────────────────────────────────────
@customElement('lucent-status-tag')
export class LucentStatusTag extends LucentElement {
  @property() variant: StatusTagVariant = 'success';
  @property() label = '';

  protected hostClasses(): string {
    return `lucent-status-tag lucent-status-tag--${this.variant}`;
  }

  protected render(): TemplateResult {
    return html`<span>${this.label}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-icon': LucentIcon;
    'lucent-tag': LucentTag;
    'lucent-status-tag': LucentStatusTag;
  }
}
