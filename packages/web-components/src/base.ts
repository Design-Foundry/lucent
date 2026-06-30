import { LitElement, type PropertyValues } from 'lit';

/**
 * Base for Lucent web components. Both variants render into **Light DOM** so the shared
 * `styles/lucent.css` (a global, class-keyed layer) styles the elements — no Shadow DOM,
 * no per-component CSS, identical `lucent-` classes to the other kits.
 *
 * `LucentElement` — for components whose content comes from props (icon, toggle, …): Lit
 * renders the full inner structure into the host (`this`).
 */
export abstract class LucentElement extends LitElement {
  /** Override to set the host element's `class` (the `.lucent-<block>` contract). */
  protected hostClasses(): string {
    return '';
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.className = this.hostClasses();
  }
}

/**
 * `LucentSurface` — for container components that **project children** (tag, card, list,
 * nav-rail, menu, …). Lit renders into a throwaway detached root, so the host's real
 * light-DOM children are never clobbered and show through, styled by the host's classes.
 */
export abstract class LucentSurface extends LitElement {
  private readonly _sink = document.createElement('div');

  protected hostClasses(): string {
    return '';
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this._sink; // detached — Lit renders here (discarded); light children remain on the host
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.className = this.hostClasses();
  }
}
