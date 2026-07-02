import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Colour axis — an unread/accent count, a severity (error/success), or neutral. */
export type BadgeVariant = 'accent' | 'error' | 'success' | 'neutral';

/** Shape/content — a numeric `count`, a short text `label`, or a bare presence `dot`. */
export type BadgeKind = 'count' | 'label' | 'dot';

@Component({
	selector: 'lucent-badge',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './badge.html',
	// Styled by the shared base (styles/components/badge.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-badge lucent-badge--" + kind() + " lucent-badge--" + variant()',
		'[attr.aria-hidden]': 'kind() === "dot" ? "true" : null',
	},
})
export class LucentBadge {
	readonly variant = input<BadgeVariant>('neutral');
	readonly kind = input<BadgeKind>('label');
	/** Shorthand for the count/label text; projected content overrides it. Ignored for `dot`. */
	readonly label = input('');
}
