import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ControlSize } from '../sizing';

export interface SegmentedOption<T = unknown> {
	label: string;
	value: T;
	disabled?: boolean;
}

/**
 * A compact inline single-select for a view/mode among a few peers (Day/Week/Month). Unlike
 * a tab-list (which switches content panels), this switches a mode; unlike radios, it's a
 * horizontal pill group. Data-driven via `options` (the segments are simple labels).
 */
@Component({
	selector: 'lucent-segmented-control',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './segmented-control.html',
	// Styled by the shared base (styles/components/segmented-control.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-segmented-control lucent-segmented-control--" + size()',
		'role': 'group',
		'[attr.aria-label]': 'label() || null',
	},
})
export class LucentSegmentedControl<T = unknown> {
	readonly options = input<SegmentedOption<T>[]>([]);
	readonly value = model<T | null>(null);
	readonly size = input<ControlSize>('md');
	/** Accessible name for the group. */
	readonly label = input('');

	protected select(opt: SegmentedOption<T>): void {
		if (opt.disabled) return;
		this.value.set(opt.value);
	}
}
