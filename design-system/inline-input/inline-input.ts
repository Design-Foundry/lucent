import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
	selector: 'df-inline-input',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './inline-input.html',
	styleUrl: './inline-input.scss',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => DfInlineInput),
		multi: true,
	}],
})
export class DfInlineInput implements ControlValueAccessor {
	readonly typography = input('');
	readonly placeholder = input('');

	readonly inputId = `df-inline-input-${nextId++}`;

	readonly value     = signal('');
	readonly isFocused = signal(false);
	readonly isDisabled = signal(false);

	readonly hostClass = computed(() => [
		this.typography(),
		this.isFocused() ? 'is-focused' : '',
		this.isDisabled() ? 'is-disabled' : '',
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
