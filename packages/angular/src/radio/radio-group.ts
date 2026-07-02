import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlSize } from '../sizing';

/**
 * Container for a set of `<lucent-radio>` children — owns the selected value and the shared
 * density, and implements `ControlValueAccessor` so it drops into `[(ngModel)]` /
 * `formControlName`. Children read/select through it (they inject this group).
 */
@Component({
	selector: 'lucent-radio-group',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	host: {
		'class': 'lucent-radio-group',
		'role': 'radiogroup',
		'[attr.aria-label]': 'label() || null',
	},
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LucentRadioGroup), multi: true }],
})
export class LucentRadioGroup<T = unknown> implements ControlValueAccessor {
	/** Accessible name for the group. */
	readonly label = input('');
	/** Density applied to every child radio (each may still override its own `size`). */
	readonly size = input<ControlSize>('md');

	readonly value = signal<T | null>(null);
	readonly isDisabled = signal(false);

	private onChange: (v: T | null) => void = () => {};
	private onTouched: () => void = () => {};

	/** Called by a child radio when the user picks it. */
	select(v: T): void {
		if (this.isDisabled()) return;
		this.value.set(v);
		this.onChange(v);
		this.onTouched();
	}

	writeValue(v: T | null): void { this.value.set(v ?? null); }
	registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
