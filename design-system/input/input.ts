import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	computed,
	contentChild,
	forwardRef,
	input,
	output,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DfIconButton } from '../icon-button/icon-button';
import { DfError, DfHint, DfLabel } from '../slots/slots';
import { ControlSize } from '../sizing';

let nextId = 0;

@Component({
	selector: 'df-input',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIconButton],
	templateUrl: './input.html',
	styleUrl: './input.scss',
	host: { '[class]': '"df-input--" + size()' },
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => DfInput),
		multi: true
	}]
})
export class DfInput implements ControlValueAccessor {
	readonly size = input<ControlSize>('md');
	readonly placeholder = input('');
	readonly type = input('text');
	readonly readonly = input(false, { transform: booleanAttribute });
	/** Shows a clear button (icon-button) once the field has a value. */
	readonly clearable = input(false, { transform: booleanAttribute });
	readonly cleared = output<void>();

	readonly inputId = `df-input-${nextId++}`;
	readonly messageId = `${this.inputId}-msg`;

	// Projected-slot presence (label/hint/error are content, not config).
	readonly labelRef = contentChild(DfLabel);
	readonly hintRef = contentChild(DfHint);
	readonly errorRef = contentChild(DfError);

	readonly value = signal('');
	readonly isFocused = signal(false);
	readonly isDisabled = signal(false);

	readonly hasError = computed(() => !!this.errorRef());
	readonly describedBy = computed(() => (this.errorRef() || this.hintRef()) ? this.messageId : null);

	readonly wrapperClass = computed(() => {
		if (this.isDisabled()) return 'df-input__wrapper--disabled';
		if (this.readonly()) return 'df-input__wrapper--readonly';
		if (this.hasError()) return 'df-input__wrapper--error';
		if (this.isFocused()) return 'df-input__wrapper--focus';
		if (this.value()) return 'df-input__wrapper--filled';
		return '';
	});

	private onChange = (_: string) => {};
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

	clear(): void {
		if (this.isDisabled() || this.readonly()) return;
		this.value.set('');
		this.onChange('');
		this.cleared.emit();
	}

	writeValue(val: string): void { this.value.set(val ?? ''); }
	registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
