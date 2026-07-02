import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	computed,
	contentChild,
	forwardRef,
	input,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucentError, LucentHint, LucentLabel } from '../slots/slots';
import { ControlSize } from '../sizing';

let nextId = 0;

@Component({
	selector: 'lucent-textarea',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './textarea.html',
	// Styled by the shared base (styles/components/textarea.css) via the lucent- contract.
	host: { '[class]': '"lucent-textarea lucent-textarea--" + size()' },
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LucentTextarea),
		multi: true,
	}],
})
export class LucentTextarea implements ControlValueAccessor {
	readonly size = input<ControlSize>('md');
	readonly placeholder = input('');
	readonly rows = input(3);
	readonly readonly = input(false, { transform: booleanAttribute });

	readonly inputId = `lucent-textarea-${nextId++}`;
	readonly messageId = `${this.inputId}-msg`;

	// Projected label/hint/error (content, not config) — mirrors text-input.
	readonly labelRef = contentChild(LucentLabel);
	readonly hintRef = contentChild(LucentHint);
	readonly errorRef = contentChild(LucentError);

	readonly value = signal('');
	readonly isFocused = signal(false);
	readonly isDisabled = signal(false);

	readonly hasError = computed(() => !!this.errorRef());
	readonly describedBy = computed(() => (this.errorRef() || this.hintRef()) ? this.messageId : null);

	readonly wrapperClass = computed(() => {
		if (this.isDisabled()) return 'lucent-textarea__wrapper--disabled';
		if (this.readonly()) return 'lucent-textarea__wrapper--readonly';
		if (this.hasError()) return 'lucent-textarea__wrapper--error';
		if (this.isFocused()) return 'lucent-textarea__wrapper--focus';
		if (this.value()) return 'lucent-textarea__wrapper--filled';
		return '';
	});

	private onChange = (_: string) => {};
	private onTouched = () => {};

	onInput(event: Event): void {
		const val = (event.target as HTMLTextAreaElement).value;
		this.value.set(val);
		this.onChange(val);
	}

	onBlur(): void {
		this.isFocused.set(false);
		this.onTouched();
	}

	writeValue(val: string): void { this.value.set(val ?? ''); }
	registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
