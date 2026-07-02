import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement } from './base';
import { cx } from './cx';
import './primitives'; // ensures <lucent-icon> is registered for nested use
import type { ReferenceKind } from './foundations';

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

declare global {
  interface HTMLElementTagNameMap {
    'lucent-reference-tag': LucentReferenceTag;
  }
}
