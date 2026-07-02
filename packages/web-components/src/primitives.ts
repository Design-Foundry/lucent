import { html, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement, LucentSurface } from './base';
import type { BadgeKind, BadgeVariant, DividerVariant, IconSize, StatusTagVariant } from './foundations';

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

// ─── lucent-badge ─────────────────────────────────────────────────────────────
@customElement('lucent-badge')
export class LucentBadge extends LucentElement {
  /** Colour axis. */
  @property() variant: BadgeVariant = 'neutral';
  /** Shape/content — numeric count, short label, or a bare dot. */
  @property() kind: BadgeKind = 'label';
  /** Count/label text; ignored for the `dot` kind. */
  @property() label = '';

  protected hostClasses(): string {
    return `lucent-badge lucent-badge--${this.kind} lucent-badge--${this.variant}`;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this.kind === 'dot') this.setAttribute('aria-hidden', 'true');
    else this.removeAttribute('aria-hidden');
  }

  protected render(): TemplateResult {
    return this.kind === 'dot' ? html`` : html`${this.label}`;
  }
}

// ─── lucent-divider ─────────────────────────────────────────────────────────────
@customElement('lucent-divider')
export class LucentDivider extends LucentElement {
  @property() variant: DividerVariant = 'plain';
  /** Label for the `labeled` variant. */
  @property() label = '';

  protected hostClasses(): string {
    return `lucent-divider lucent-divider--${this.variant}`;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.setAttribute('role', 'separator');
  }

  protected render(): TemplateResult {
    return this.variant === 'labeled' ? html`${this.label}` : html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-icon': LucentIcon;
    'lucent-tag': LucentTag;
    'lucent-status-tag': LucentStatusTag;
    'lucent-badge': LucentBadge;
    'lucent-divider': LucentDivider;
  }
}
