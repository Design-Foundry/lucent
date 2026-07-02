import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DividerVariant = 'plain' | 'labeled';

/**
 * The unified separator. `plain` is a hairline rule (the canonical replacement for the old
 * nav-divider / menu-divider — those remain for now, this is additive). `labeled` is a rule with
 * centered text ("Today", section labels). Labeled text projects, with a `label` fallback.
 */
@Component({
	selector: 'lucent-divider',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './divider.html',
	// Styled by the shared base (styles/components/divider.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-divider lucent-divider--" + variant()',
		'role': 'separator',
	},
})
export class LucentDivider {
	readonly variant = input<DividerVariant>('plain');
	/** Label for the `labeled` variant; projected content overrides it. */
	readonly label = input('');
}
