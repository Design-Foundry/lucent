import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
	selector: 'lucent-spinner',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// The ring is pure CSS (styles/components/spinner.css) — no template content.
	template: '',
	host: {
		'[class]': '"lucent-spinner lucent-spinner--" + size()',
		'role': 'status',
		'[attr.aria-label]': 'label() || "Loading"',
	},
})
export class LucentSpinner {
	readonly size = input<SpinnerSize>('md');
	/** Accessible name announced to assistive tech. Defaults to "Loading". */
	readonly label = input('');
}
