import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlSize } from '../sizing';

export type ToggleSize = ControlSize;

@Component({
	selector: 'lucent-toggle',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './toggle.html',
	// Styled by the shared base (styles/components/toggle.css); the CSS supports this kit's
	// `.is-checked`/`.is-disabled` host classes (the `__input:checked` rules are Razor-only).
	host: {
		'role': 'switch',
		'[attr.tabindex]': 'isDisabled() ? -1 : 0',
		'[attr.aria-checked]': 'checked()',
		'[attr.aria-disabled]': 'isDisabled() || null',
		'[attr.aria-label]': 'label() || null',
		'[class]': '"lucent-toggle lucent-toggle--" + size()',
		'[class.is-checked]': 'checked()',
		'[class.is-disabled]': 'isDisabled()',
		'(click)': 'toggle()',
		'(keydown.space)': '_onKey($event)',
		'(keydown.enter)': '_onKey($event)'
	},
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LucentToggle),
		multi: true
	}]
})
export class LucentToggle implements ControlValueAccessor {
	readonly size = input<ToggleSize>('md');
	readonly label = input('');

	checked = signal(false);
	isDisabled = signal(false);

	private onChange = (_: boolean) => {};
	private onTouched = () => {};

	toggle(): void {
		if (this.isDisabled()) return;
		const next = !this.checked();
		this.checked.set(next);
		this.onChange(next);
		this.onTouched();
	}

	_onKey(event: Event): void {
		event.preventDefault();
		this.toggle();
	}

	writeValue(val: boolean): void { this.checked.set(!!val); }
	registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
