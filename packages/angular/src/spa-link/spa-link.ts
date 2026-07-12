import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * SPA-navigation adapter for Lucent's anchor-based navigation (breadcrumbs, navigate-role
 * buttons, links). Lucent renders navigation as a real `<a href>` for correct semantics and
 * accessibility — the AT "link" role, a real URL, middle-click / ⌘-click / open-in-new-tab,
 * and "copy link address". This directive keeps all of that and only enhances the *plain
 * left-click*: it intercepts clicks on same-origin anchors within the host and routes them
 * through the Angular Router instead of triggering a full-page load.
 *
 * Everything that should stay native is left untouched — modified clicks (Ctrl/Cmd/Shift/Alt),
 * middle/right clicks, an explicit `target`, a `download`, `rel="external"`, cross-origin hrefs,
 * and already-handled events all fall through to the browser. Keyboard activation needs no
 * special handling: Enter on an anchor dispatches a click, which this catches.
 *
 * Apply it to a container — it delegates to descendant anchors, which is what breadcrumbs need
 * since their `<a>`s are rendered internally — or directly to a single `<a>`:
 *
 * ```html
 * <lucent-breadcrumbs lucentSpaLink [items]="crumbs()" />
 * <a lucentSpaLink href="/projects">Projects</a>
 * ```
 */
@Directive({
	selector: '[lucentSpaLink]',
	standalone: true,
	host: { '(click)': 'onClick($event)' },
})
export class LucentSpaLink {
	private readonly router = inject(Router);

	onClick(event: MouseEvent): void {
		// Only a plain left-click is ours; the browser owns every other gesture.
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		const anchor = (event.target as HTMLElement | null)?.closest('a');
		if (!anchor?.hasAttribute('href')) return;

		// Leave native behaviour for new tab/window, downloads, opt-out, and cross-origin links.
		if (anchor.target && anchor.target !== '_self') return;
		if (anchor.hasAttribute('download')) return;
		if (anchor.relList.contains('external')) return;
		if (anchor.origin !== location.origin) return;

		event.preventDefault();
		void this.router.navigateByUrl(anchor.pathname + anchor.search + anchor.hash);
	}
}
