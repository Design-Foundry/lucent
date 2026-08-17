import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * A titled set of {@link LucentNavItem}s. Separate groups with a `lucent-divider`.
 *
 * The heading is hidden when the surrounding {@link LucentNavRail} is compact, but the group
 * keeps its accessible name via `aria-label`, so the grouping survives collapse for AT.
 *
 * ```html
 * <lucent-nav-group heading="Workspace">
 *   <lucent-nav-item name="dashboard" label="Overview" href="/" />
 *   <lucent-nav-item name="group" label="Members" href="/members" />
 * </lucent-nav-group>
 * ```
 *
 * The heading input is `heading`, not `title`: a `title` input would collide with the native
 * `title` attribute and render a stray browser tooltip over the whole group.
 */
@Component({
	selector: 'lucent-nav-group',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './nav-group.html',
	// Styled by the shared base (styles/components/nav-group.css) via the lucent- contract.
	host: {
		'class': 'lucent-nav-group',
		'role': 'group',
		'[attr.aria-label]': 'heading() || null',
	},
})
export class LucentNavGroup {
	/** Section heading. Also the group's accessible name. */
	readonly heading = input('');
	/** Render the heading. Off gives an untitled group that still reads as one for AT. */
	readonly showHeading = input(true, { transform: booleanAttribute });
}
