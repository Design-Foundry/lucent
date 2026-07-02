import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

@Component({
	selector: 'lucent-progress',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './progress.html',
	// Styled by the shared base (styles/components/progress.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-progress" + (indeterminate() ? " lucent-progress--indeterminate" : "")',
		'role': 'progressbar',
		'[attr.aria-valuemin]': 'indeterminate() ? null : 0',
		'[attr.aria-valuemax]': 'indeterminate() ? null : max()',
		'[attr.aria-valuenow]': 'indeterminate() ? null : value()',
		'[attr.aria-label]': 'label() || null',
	},
})
export class LucentProgress {
	readonly value = input(0);
	readonly max = input(100);
	readonly indeterminate = input(false, { transform: booleanAttribute });
	/** Accessible name for the bar (e.g. "Uploading"). */
	readonly label = input('');

	protected readonly pct = computed(() => {
		const max = this.max() || 100;
		return Math.max(0, Math.min(100, (this.value() / max) * 100));
	});
}
