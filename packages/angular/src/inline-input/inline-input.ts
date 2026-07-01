import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
	selector: 'lucent-inline-input',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './inline-input.html',
	// Styled by the shared base (styles/components/inline-input.css) via the lucent- contract.
	// The host is the .lucent-inline-input wrapper; the <input> carries __field + typography.
	host: { 'class': 'lucent-inline-input' },
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LucentInlineInput),
		multi: true,
	}],
})
export class LucentInlineInput implements ControlValueAccessor {
	readonly typography = input('');
	readonly placeholder = input('');

	readonly inputId = `lucent-inline-input-${nextId++}`;

	readonly value     = signal('');
	readonly isFocused = signal(false);
	readonly isDisabled = signal(false);

	// Field class: the __field contract element + the consumer's typography utility.
	// Focus/disabled are pure CSS (:focus/:disabled) in the shared base, so no state classes.
	readonly fieldClass = computed(() => [
		'lucent-inline-input__field',
		this.typography(),
	].filter(Boolean).join(' '));

	private onChange  = (_: string) => {};
	private onTouched = () => {};

	onInput(event: Event): void {
		const val = (event.target as HTMLInputElement).value;
		this.value.set(val);
		this.onChange(val);
	}

	onBlur(): void {
		this.isFocused.set(false);
		this.onTouched();
	}

	writeValue(val: string): void        { this.value.set(val ?? ''); }
	registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void         { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void       { this.isDisabled.set(disabled); }
}
