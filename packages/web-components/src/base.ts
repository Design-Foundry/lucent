import { LitElement, type PropertyValues } from 'lit';

/**
 * Applies `hostClasses()` to the host's `class` WITHOUT clobbering classes set by a
 * parent. A parent kit often puts a layout hook on a nested Lucent element (e.g.
 * `<lucent-badge class="lucent-chat-trigger__badge">`); a blanket `this.className = …`
 * would drop it on upgrade. So we track the classes WE own and only swap those, leaving
 * any author-provided classes in place — matching how the React/Angular/Blazor kits merge.
 */
function applyHostClasses(el: Element, owned: string, prev: string): void {
  const next = owned ? owned.split(/\s+/).filter(Boolean) : [];
  const old = prev ? prev.split(/\s+/).filter(Boolean) : [];
  for (const c of old) if (!next.includes(c)) el.classList.remove(c);
  for (const c of next) el.classList.add(c);
}

/**
 * Base for Lucent web components. Both variants render into **Light DOM** so the shared
 * `styles/lucent.css` (a global, class-keyed layer) styles the elements — no Shadow DOM,
 * no per-component CSS, identical `lucent-` classes to the other kits.
 *
 * `LucentElement` — for components whose content comes from props (icon, toggle, …): Lit
 * renders the full inner structure into the host (`this`).
 */
export abstract class LucentElement extends LitElement {
  private _ownedClasses = '';

  /** Override to set the host element's `class` (the `.lucent-<block>` contract). */
  protected hostClasses(): string {
    return '';
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const owned = this.hostClasses();
    applyHostClasses(this, owned, this._ownedClasses);
    this._ownedClasses = owned;
  }
}

/**
 * `LucentSurface` — for container components that **project children** (tag, card, list,
 * nav-rail, menu, …). Lit renders into a throwaway detached root, so the host's real
 * light-DOM children are never clobbered and show through, styled by the host's classes.
 */
export abstract class LucentSurface extends LitElement {
  private readonly _sink = document.createElement('div');
  private _ownedClasses = '';

  protected hostClasses(): string {
    return '';
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this._sink; // detached — Lit renders here (discarded); light children remain on the host
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const owned = this.hostClasses();
    applyHostClasses(this, owned, this._ownedClasses);
    this._ownedClasses = owned;
  }
}
