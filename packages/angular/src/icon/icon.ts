import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
	selector: 'df-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './icon.html',
	// Styles come from the shared base (styles/components/icon.css) via the lucent- class
	// contract; size is the --lucent-icon--{size} class (no inline font-size).
	host: {
		'[class]': '"lucent-icon lucent-icon--" + size()',
		// Decorative by default (hidden from AT); when ariaLabel is set the icon is
		// meaningful, so expose it as a labelled image instead.
		'[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
		'[attr.role]': 'ariaLabel() ? "img" : null',
		'[attr.aria-label]': 'ariaLabel() || null',
	}
})
export class DfIcon {
	readonly name = input('widgets');
	readonly size = input<IconSize>('md');
	/** Set when the icon conveys meaning on its own. Leave empty for decorative icons. */
	readonly ariaLabel = input('');
}
