import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	ElementRef,
	forwardRef,
	input,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { LucentIcon } from '../icon/icon';
import { LucentOption } from '../option/option';
import { LucentError, LucentHint, LucentLabel } from '../slots/slots';
import { ControlSize } from '../sizing';

export interface SelectOption {
	label: string;
	value: unknown;
}

let nextId = 0;

@Component({
	selector: 'lucent-select',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, LucentIcon, LucentOption],
	templateUrl: './select.html',
	// Styled by the shared base (styles/components/select.css) via the lucent- contract.
	host: { '[class]': '"lucent-select lucent-select--" + size()' },
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LucentSelect),
		multi: true
	}]
})
export class LucentSelect implements ControlValueAccessor {
	readonly size = input<ControlSize>('md');
	readonly placeholder = input('Select an option');
	readonly options = input<SelectOption[]>([]);
	readonly selectionChange = output<unknown>();

	readonly listboxId = `lucent-select-${nextId++}`;
	readonly labelId = `${this.listboxId}-label`;
	readonly messageId = `${this.listboxId}-msg`;
	optionId = (i: number) => `${this.listboxId}-opt-${i}`;

	// label/hint/error are projected content (consistent with lucent-text-input).
	readonly labelRef = contentChild(LucentLabel);
	readonly hintRef = contentChild(LucentHint);
	readonly errorRef = contentChild(LucentError);

	private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');

	selectedValue = signal<unknown>(null);
	isOpen = signal(false);
	isFocused = signal(false);
	isDisabled = signal(false);
	activeIndex = signal(-1);
	triggerWidth = signal<number>(0);

	readonly overlayPositions: ConnectedPosition[] = [
		{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
		{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
	];

	readonly hasError = computed(() => !!this.errorRef());
	readonly describedBy = computed(() => (this.errorRef() || this.hintRef()) ? this.messageId : null);

	readonly selectedIndex = computed(() =>
		this.options().findIndex(o => o.value === this.selectedValue()));

	readonly selectedLabel = computed(() => this.options()[this.selectedIndex()]?.label ?? '');

	readonly activeDescendant = computed(() =>
		this.isOpen() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null);

	readonly triggerClass = computed(() => {
		if (this.isDisabled()) return 'lucent-select__trigger--disabled';
		if (this.hasError()) return 'lucent-select__trigger--error';
		if (this.isOpen() || this.isFocused()) return 'lucent-select__trigger--focus';
		const v = this.selectedValue();
		if (v !== null && v !== undefined && v !== '') return 'lucent-select__trigger--filled';
		return '';
	});

	private onChange = (_: unknown) => {};
	private onTouched = () => {};

	open(): void {
		if (this.isDisabled() || this.isOpen()) return;
		this.triggerWidth.set(this.trigger().nativeElement.offsetWidth);
		this.isOpen.set(true);
		this.isFocused.set(true);
		const sel = this.selectedIndex();
		this.activeIndex.set(sel >= 0 ? sel : (this.options().length ? 0 : -1));
	}

	close(): void {
		if (!this.isOpen()) return;
		this.isOpen.set(false);
		this.onTouched();
	}

	toggle(): void {
		this.isOpen() ? this.close() : this.open();
	}

	selectAt(i: number): void {
		const opt = this.options()[i];
		if (!opt) return;
		this.selectedValue.set(opt.value);
		this.onChange(opt.value);
		this.selectionChange.emit(opt.value);
		this.close();
		this.trigger().nativeElement.focus();
	}

	onTriggerKeydown(event: KeyboardEvent): void {
		if (this.isDisabled()) return;

		if (!this.isOpen()) {
			if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
				event.preventDefault();
				this.open();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown': event.preventDefault(); this.move(1); break;
			case 'ArrowUp':   event.preventDefault(); this.move(-1); break;
			case 'Home':      event.preventDefault(); this.activeIndex.set(0); break;
			case 'End':       event.preventDefault(); this.activeIndex.set(this.options().length - 1); break;
			case 'Enter':
			case ' ':         event.preventDefault(); this.selectAt(this.activeIndex()); break;
			case 'Escape':    event.preventDefault(); this.close(); this.trigger().nativeElement.focus(); break;
			case 'Tab':         this.close(); break;
		}
	}

	private move(delta: number): void {
		const n = this.options().length;
		if (!n) return;
		const next = (this.activeIndex() + delta + n) % n;
		this.activeIndex.set(next);
	}

	writeValue(val: unknown): void { this.selectedValue.set(val ?? null); }
	registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }
	setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }
}
