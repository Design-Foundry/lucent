import { ChangeDetectionStrategy, Component, booleanAttribute, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucentIcon } from '../icon/icon';
import { ControlSize } from '../sizing';

@Component({
	selector: 'lucent-checkbox',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './checkbox.html',
	// Styled by the shared base (styles/components/checkbox.css); the CSS supports this kit's
	// `.is-checked`/`.is-indeterminate`/`.is-disabled` host classes (`__input` rules are Razor-only).
	host: {
		'role': 'checkbox',
		'[class]': '"lucent-checkbox lucent-checkbox--" + size()',
		'[attr.tabindex]': 'isDisabled() ? -1 : 0',
		'[attr.aria-checked]': 'indeterminate() ? "mixed" : checked()',
		'[attr.aria-disabled]': 'isDisabled() || null',
		'[attr.aria-label]': 'label() || null',
		'[class.is-checked]': 'checked()',
		'[class.is-indeterminate]': 'indeterminate()',
		'[class.is-focused]': 'isFocused()',
		'[class.is-disabled]': 'isDisabled()',
		'(click)': 'toggle()',
		'(keydown.space)': '_onSpace($event)',
		'(focus)': 'isFocused.set(true)',
		'(blur)': 'isFocused.set(false)'
	},
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LucentCheckbox),
		multi: true
	}]
})
export class LucentCheckbox implements ControlValueAccessor {
	readonly size = input<ControlSize>('md');
	readonly label = input('');
	readonly indeterminate = input(false, { transform: booleanAttribute });

	checked = signal(false);
	isFocused = signal(false);
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

	_onSpace(event: Event): void {
		event.preventDefault(); // stop the page from scrolling
		this.toggle();
	}

	writeValue(val: boolean): void { this.checked.set(!!val); }
	registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
