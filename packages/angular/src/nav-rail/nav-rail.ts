import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * Vertical glass navigation rail. Content projects in — {@link LucentNavGroup}s,
 * {@link LucentNavItem}s and `lucent-divider`s.
 *
 * The rail owns the compact/expanded state and its children adapt through the CSS class
 * contract, so consumers never thread a flag through every row:
 *
 * ```html
 * <lucent-nav-rail [expanded]="expanded()" lucentSpaLink>
 *   <lucent-nav-group heading="Workspace">
 *     <lucent-nav-item name="dashboard" label="Overview" href="/" [active]="true" />
 *   </lucent-nav-group>
 *   <lucent-divider />
 * </lucent-nav-rail>
 * ```
 *
 * Compact is the default: labels and headings stay in the DOM and are hidden visually, with
 * the accessible name on each item, so collapsing never costs AT the name. Override the
 * expanded width with `--lucent-nav-rail-width`.
 */
@Component({
	selector: 'lucent-nav-rail',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './nav-rail.html',
	// Styled by the shared base (styles/components/nav-rail.css) via the lucent- contract.
	host: {
		'class': 'lucent-nav-rail',
		'[class.is-expanded]': 'expanded()',
	},
})
export class LucentNavRail {
	readonly expanded = input(false, { transform: booleanAttribute });
}
