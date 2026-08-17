import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { LucentIcon } from '../icon/icon';

/**
 * @deprecated Superseded by {@link LucentNavItem}, which is the same row with a label and
 * renders as a real `<a href>`; a compact rail hides the label for you. Kept for back-compat —
 * this is icon-only and has no navigation semantics of its own, so it needs a wrapping anchor.
 */
@Component({
	selector: 'lucent-nav-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './nav-icon.html',
	// Styled by the shared base (styles/components/nav-icon.css) via the lucent- contract.
	host: {
		'class': 'lucent-nav-icon',
		'[class.is-active]': 'active()',
		'[class.is-disabled]': 'disabled()',
		'[attr.aria-disabled]': 'disabled() || null',
		'[attr.aria-label]': 'ariaLabel() || null',
		'[attr.title]': 'ariaLabel() || null'
	}
})
export class LucentNavIcon {
	readonly name = input('widgets');
	readonly active = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	/** Accessible name for this icon-only nav item (required for AT). */
	readonly ariaLabel = input('');
}
