import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { LucentIcon } from '../icon/icon';

/**
 * A navigation row for the nav rail (and any vertical nav). Renders a real `<a href>` —
 * Lucent's navigation-is-a-link contract — so it keeps the AT link role, a real URL,
 * middle-click / open-in-new-tab, and marks the current page with `aria-current`.
 *
 * Compact vs labelled is **not** a property of the item: the surrounding
 * {@link LucentNavRail} drives it through the class contract, so an item adapts to its
 * container instead of every consumer threading a flag through every row. Outside a rail
 * an item renders labelled.
 *
 * The label is always exposed as the accessible name, so a compact rail — where the label
 * is visually hidden — still announces correctly.
 *
 * ```html
 * <lucent-nav-item icon="dashboard" label="Overview" href="/" [active]="true" />
 * <lucent-nav-item icon="group" label="Members" href="/members" subtitle="12 people" />
 * ```
 *
 * Pair with `[lucentSpaLink]` on the rail to route clicks client-side.
 */
@Component({
	selector: 'lucent-nav-item',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './nav-item.html',
	// Styled by the shared base (styles/components/nav-item.css) via the lucent- contract.
	// The host is display:contents so the anchor below is the rail's flex child.
	host: { 'class': 'lucent-nav-item-host' },
})
export class LucentNavItem {
	/** Material Icons ligature (e.g. `dashboard`, `folder`). */
	readonly name = input('widgets');
	/** Visible label, and the accessible name in every mode. */
	readonly label = input('');
	/** Optional second line. Hidden with the label when the rail is compact. */
	readonly subtitle = input('');
	/** Navigation destination. Dropped when disabled, so the item stops being focusable. */
	readonly href = input('');
	readonly active = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
}
